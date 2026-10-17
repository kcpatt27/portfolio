// scripts/sync-from-shared-docs.ts
// Generates metadata/projects.config.json from the shared-docs evidence store.
//
// Source of truth for *publishability*: each shared-docs summary's frontmatter
//   publish: public | private | embargoed
//   commercial: true | false
//   portfolio_id: <id used by this site>
// The portfolio keeps only a presentation overlay (metadata/portfolio-overlay.json).
//
// Default-deny: a summary with no frontmatter, or publish != "public", or
// commercial == true, never enters the site.
//
// If the shared-docs checkout is unavailable (e.g. CI), the committed config is
// kept and a warning is printed.

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import yaml from 'js-yaml'

interface Frontmatter {
  title?: string
  publish?: string
  commercial?: boolean
  portfolio_id?: string
}

interface Overlay {
  description?: string
  status?: string
  completionPercent?: number
  featured?: boolean
  localPath?: string
  technologies?: string[]
  liveUrl?: string
  publishable?: string[]
  never?: string[]
}

const root = process.cwd()
const sharedDocs = resolve(root, process.env.SHARED_DOCS_PATH ?? '../../shared-docs')
const overlayPath = resolve(root, 'metadata/portfolio-overlay.json')
const configPath = resolve(root, 'metadata/projects.config.json')

if (!existsSync(sharedDocs)) {
  console.warn(`[sync] shared-docs not found at ${sharedDocs} — keeping the committed config.`)
  process.exit(0)
}

const overlay = JSON.parse(readFileSync(overlayPath, 'utf8')) as Record<string, Overlay>
const projects: Array<Record<string, unknown>> = []

for (const entry of readdirSync(sharedDocs, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const dir = join(sharedDocs, entry.name)
  const summary = readdirSync(dir).find((f) => /^summary-for-career.*\.md$/.test(f))
  if (!summary) continue

  const text = readFileSync(join(dir, summary), 'utf8')
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(text)
  if (!match) continue

  let fm: Frontmatter
  try {
    fm = (yaml.load(match[1]) ?? {}) as Frontmatter
  } catch {
    console.warn(`[sync] ${entry.name}: unreadable frontmatter — skipped`)
    continue
  }

  if (fm.publish !== 'public') continue
  if (fm.commercial) continue

  const id = fm.portfolio_id || entry.name
  const presentation = overlay[id]
  if (!presentation) {
    console.warn(`[sync] ${entry.name}: public but no overlay entry for "${id}" — skipped`)
    continue
  }

  projects.push({
    id,
    name: fm.title || entry.name,
    description: presentation.description ?? '',
    status: presentation.status ?? 'completed',
    completionPercent: presentation.completionPercent ?? null,
    featured: presentation.featured ?? false,
    localPath: presentation.localPath ?? '',
    specsFile: 'project_specs.md',
    roadmapFile: 'ROADMAP.md',
    architectureFile: 'ARCHITECTURE.md',
    technologies: presentation.technologies ?? [],
    aiBuilt: true,
    liveUrl: presentation.liveUrl ?? '',
    release: {
      visibility: fm.publish,
      commercial: Boolean(fm.commercial),
      publishable: presentation.publishable ?? ['README.md', 'ARCHITECTURE.md'],
      never: presentation.never ?? ['ROADMAP.md', 'project_specs.md'],
    },
    source: `shared-docs/${entry.name}/${summary}`,
  })
}

projects.sort((a, b) => {
  const featured = Number(b.featured) - Number(a.featured)
  return featured !== 0 ? featured : String(a.name).localeCompare(String(b.name))
})

writeFileSync(configPath, `${JSON.stringify({ projects }, null, 2)}\n`)
console.log(`[sync] wrote ${projects.length} public project(s) to metadata/projects.config.json`)
