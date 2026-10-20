// scripts/symlink-project-docs.ts
// Copies *publishable* project docs into _project-docs/<id>/ for the public site.
// Default-deny: a project with no release block, a non-public visibility, or a
// commercial flag is skipped. Roadmap/PRD files are never copied — the site shows
// a timeline, not a plan. The copied Markdown is also scrubbed of roadmap/PRD/
// specification sections and links, because those can live inside an otherwise
// publishable README.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { isAbsolute, resolve } from 'path'

interface Release {
  visibility?: string
  commercial?: boolean
  publishable?: string[]
}

interface ProjectConfig {
  id: string
  name?: string
  localPath: string
  docsFolder?: string
  architectureFile?: string
  release?: Release
  [key: string]: unknown
}

const root = process.cwd()

const forbidden = /\b(roadmap|prds?|project[_ ]specs?|specifications)\b/i

function scrubMarkdown(markdown: string): { text: string; changed: boolean } {
  const lines = markdown.split(/\r?\n/)
  const output: string[] = []
  let skippingSection = false
  let changed = false

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      if (forbidden.test(heading[2])) {
        skippingSection = true
        changed = true
        continue
      }
      if (skippingSection && heading[1].length <= 2) {
        skippingSection = false
      }
    }

    if (skippingSection) {
      if (heading && heading[1].length <= 2) {
        skippingSection = false
        output.push(line)
      } else {
        changed = true
      }
      continue
    }

    if (forbidden.test(line)) {
      changed = true
      continue
    }

    output.push(line)
  }

  return { text: output.join('\n'), changed }
}

function run() {
  const configPath = resolve(root, 'metadata/projects.config.json')
  const config = JSON.parse(readFileSync(configPath, 'utf8')) as { projects: ProjectConfig[] }
  const docsDir = resolve(root, '_project-docs')

  rmSync(docsDir, { recursive: true, force: true })
  mkdirSync(docsDir, { recursive: true })

  for (const project of config.projects) {
    const release = project.release
    if (!release || release.visibility !== 'public' || release.commercial) {
      console.warn(`[docs] Skipping ${project.id}: not public (default-deny)`)
      continue
    }

    const allow = new Set(release.publishable ?? [])
    const folderName = project.docsFolder || project.id
    const projectDocsDir = resolve(docsDir, folderName)
    const localBase = isAbsolute(project.localPath) ? project.localPath : resolve(root, project.localPath)

    if (!existsSync(localBase)) {
      console.warn(`[docs] Skipping ${project.id}: localPath "${project.localPath}" not found`)
      continue
    }

    mkdirSync(projectDocsDir, { recursive: true })

    const candidates: Array<[string, string]> = [
      ['README.md', 'README.md'],
      [project.architectureFile || 'ARCHITECTURE.md', 'ARCHITECTURE.md'],
    ]

    for (const [sourceName, targetName] of candidates) {
      if (!allow.has(targetName)) continue
      const src = resolve(localBase, sourceName)
      if (!existsSync(src)) continue
      try {
        const markdown = readFileSync(src, 'utf8')
        const scrubbed = scrubMarkdown(markdown)
        writeFileSync(resolve(projectDocsDir, targetName), scrubbed.text, 'utf8')
        if (scrubbed.changed) {
          console.log(`[docs] ${project.id}/${targetName}: removed roadmap/PRD/spec content`)
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        console.warn(`[docs] ${project.id}/${targetName}: ${msg}`)
      }
    }
  }

  console.log('[docs] Done. Only files marked publishable were copied and scrubbed.')
}

run()
