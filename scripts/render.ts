// scripts/render.ts
// Renders the timeline list (timeline.html) and the latest-six log (index.html)
// from metadata/timeline.json. Project facts like status and version come from
// metadata/projects.json through {{project.field}} tokens.
//
// Generated regions are marked in the HTML and rewritten in place. Everything
// outside the markers stays hand-written. --check fails when the committed HTML
// is stale.

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

interface Project {
  id: string
  status?: string
  version?: string
  npmDownloads?: number | null
  checked?: string
  [key: string]: unknown
}

interface Entry {
  when: string
  title: string
  href?: string
  summary: string
  status: string
}

const root = process.cwd()
const projects = (JSON.parse(readFileSync(resolve(root, 'metadata/projects.json'), 'utf8')) as { projects: Project[] }).projects
const entries = (JSON.parse(readFileSync(resolve(root, 'metadata/timeline.json'), 'utf8')) as { entries: Entry[] }).entries
const byId = new Map(projects.map((p) => [p.id, p]))

const check = process.argv.includes('--check')

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function fact(id: string, field: string): string {
  const project = byId.get(id)
  if (!project) throw new Error(`unknown project "${id}" in a timeline token or data-fact`)
  const value = project[field]
  if (value === undefined || value === null || value === '') {
    throw new Error(`${id}.${field} is empty; refresh metadata/projects.json first`)
  }
  return String(value)
}

function resolveTokens(text: string): string {
  return text.replace(/\{\{([a-z0-9-]+)\.([a-zA-Z]+)\}\}/g, (_, id: string, field: string) => fact(id, field))
}

function renderEntries(): string {
  return entries
    .map((entry) => {
      const title = escapeHtml(resolveTokens(entry.title))
      const heading = entry.href
        ? `<a href="${escapeHtml(entry.href)}">${title}</a>`
        : title
      const when = escapeHtml(resolveTokens(entry.when))
      const summary = escapeHtml(resolveTokens(entry.summary))
      const status = escapeHtml(resolveTokens(entry.status))
      return `        <li>
          <span class="entry-when">${when}</span>
          <div class="entry-what">
            <h2>${heading}</h2>
            <p>${summary}</p>
            <span class="entry-tag">${status}</span>
          </div>
        </li>`
    })
    .join('\n')
}

function renderLatest(limit: number): string {
  return entries
    .slice(0, limit)
    .map((entry) => {
      const when = escapeHtml(resolveTokens(entry.when))
      const title = escapeHtml(resolveTokens(entry.title))
      const summary = escapeHtml(resolveTokens(entry.summary))
      return `        <li>
          <span class="when">${when}</span>
          <span class="what"><strong>${title}.</strong> ${summary}</span>
        </li>`
    })
    .join('\n')
}

function replaceRegion(html: string, start: string, end: string, body: string): string {
  const startIndex = html.indexOf(start)
  const endIndex = html.indexOf(end, startIndex + start.length)
  if (startIndex < 0 || endIndex < 0) throw new Error(`missing render markers ${start} / ${end}`)
  const lineStart = html.lastIndexOf('\n', endIndex) + 1
  const indent = html.slice(lineStart, endIndex)
  return `${html.slice(0, startIndex + start.length)}\n${body}\n${indent}${html.slice(endIndex)}`
}

function replaceFacts(html: string): string {
  return html.replace(/<span([^>]*\bdata-fact="([^"]+)"[^>]*)>[^<]*<\/span>/g, (_, attrs: string, key: string) => {
    const [id, field] = key.split('.')
    if (!id || !field) throw new Error(`bad data-fact key "${key}"`)
    return `<span${attrs}>${escapeHtml(fact(id, field))}</span>`
  })
}

function replaceCounts(html: string): string {
  return html.replace(/<span data-count="timeline">[^<]*<\/span>/g, `<span data-count="timeline">${entries.length}</span>`)
}

const outputs: Array<{ file: string; html: string }> = [
  {
    file: 'timeline.html',
    html: replaceCounts(
      replaceFacts(
        replaceRegion(
          readFileSync(resolve(root, 'timeline.html'), 'utf8'),
          '<!-- timeline:start -->',
          '<!-- timeline:end -->',
          renderEntries(),
        ),
      ),
    ),
  },
  {
    file: 'index.html',
    html: replaceFacts(
      replaceRegion(
        readFileSync(resolve(root, 'index.html'), 'utf8'),
        '<!-- timeline:latest:start -->',
        '<!-- timeline:latest:end -->',
        renderLatest(6),
      ),
    ),
  },
]

let stale = 0
for (const output of outputs) {
  const current = readFileSync(resolve(root, output.file), 'utf8')
  if (current === output.html) continue
  if (check) {
    console.error(`STALE ${output.file} (run: npm run render)`)
    stale += 1
  } else {
    writeFileSync(resolve(root, output.file), output.html)
    console.log(`rendered ${output.file}`)
  }
}

if (check) {
  if (stale > 0) process.exit(1)
  console.log(`Render check: OK (${entries.length} entries, ${projects.length} projects)`)
} else {
  console.log(`Render: ${entries.length} entries, ${projects.length} projects`)
}
