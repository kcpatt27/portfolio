// scripts/symlink-project-docs.ts
// Creates symlinks from each project's README.md and ROADMAP.md (per config) into
// _project-docs/<id>/ so the portfolio site can fetch and display them when a project card is clicked.

import { readFileSync, mkdirSync, symlinkSync, existsSync, unlinkSync } from 'fs'
import { resolve, isAbsolute } from 'path'

const root = process.cwd()

interface ProjectConfig {
  id: string
  name: string
  localPath: string
  roadmapFile?: string
  docsFolder?: string
  specsFile?: string
  architectureFile?: string
  [key: string]: unknown
}

function run() {
  const configPath = resolve(root, 'metadata/projects.config.json')
  const config = JSON.parse(readFileSync(configPath, 'utf8')) as { projects: ProjectConfig[] }
  const docsDir = resolve(root, '_project-docs')

  mkdirSync(docsDir, { recursive: true })

  for (const project of config.projects) {
    const folderName = project.docsFolder || project.id
    const projectDocsDir = resolve(docsDir, folderName)
    const localBase = isAbsolute(project.localPath) ? project.localPath : resolve(root, project.localPath)

    if (!existsSync(localBase)) {
      console.warn(`[symlink-project-docs] Skipping ${project.id}: localPath "${project.localPath}" not found`)
      continue
    }

    mkdirSync(projectDocsDir, { recursive: true })

    // README.md (optional in many projects)
    const readmeSrc = resolve(localBase, 'README.md')
    const readmeDst = resolve(projectDocsDir, 'README.md')
    if (existsSync(readmeSrc)) {
      link(readmeSrc, readmeDst, folderName, 'README.md')
    }

    // ROADMAP.md (or whatever roadmapFile is in config)
    const roadmapSrc = resolve(localBase, project.roadmapFile || 'ROADMAP.md')
    const roadmapDst = resolve(projectDocsDir, 'ROADMAP.md')
    if (existsSync(roadmapSrc)) {
      link(roadmapSrc, roadmapDst, folderName, project.roadmapFile || 'ROADMAP.md')
    }

    // specsFile
    const specsSrc = resolve(localBase, project.specsFile || 'project_specs.md')
    const specsDst = resolve(projectDocsDir, 'project_specs.md')
    if (existsSync(specsSrc)) {
      link(specsSrc, specsDst, folderName, 'project_specs.md')
    }

    // architectureFile
    const archSrc = resolve(localBase, project.architectureFile || 'ARCHITECTURE.md')
    const archDst = resolve(projectDocsDir, 'ARCHITECTURE.md')
    if (existsSync(archSrc)) {
      link(archSrc, archDst, folderName, 'ARCHITECTURE.md')
    }
  }
  console.log('[symlink-project-docs] Done. Docs are under _project-docs/<folder>/')
}

function link(src: string, dst: string, projectId: string, label: string) {
  try {
    if (existsSync(dst)) {
      try {
        unlinkSync(dst)
      } catch {
        // ignore
      }
    }
    symlinkSync(src, dst, 'file')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.warn(`[symlink-project-docs] ${projectId}/${label}: ${msg}`)
  }
}

run()
