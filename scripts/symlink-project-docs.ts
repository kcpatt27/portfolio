// scripts/symlink-project-docs.ts
// Copies *publishable* project docs into _project-docs/<id>/ for the public site.
// Default-deny: a project with no release block, a non-public visibility, or a
// commercial flag is skipped. Roadmap/PRD files are never copied — the site shows
// a timeline, not a plan. (We copy rather than symlink: GitHub Pages does not
// preserve symlink targets.)

import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'fs'
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
  roadmapFile?: string
  docsFolder?: string
  specsFile?: string
  architectureFile?: string
  release?: Release
  [key: string]: unknown
}

const root = process.cwd()

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
      [project.roadmapFile || 'ROADMAP.md', 'ROADMAP.md'],
      [project.specsFile || 'project_specs.md', 'project_specs.md'],
      [project.architectureFile || 'ARCHITECTURE.md', 'ARCHITECTURE.md'],
    ]

    for (const [sourceName, targetName] of candidates) {
      if (!allow.has(targetName)) continue
      const src = resolve(localBase, sourceName)
      if (!existsSync(src)) continue
      try {
        copyFileSync(src, resolve(projectDocsDir, targetName))
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        console.warn(`[docs] ${project.id}/${targetName}: ${msg}`)
      }
    }
  }

  console.log('[docs] Done. Only files marked publishable were copied.')
}

run()
