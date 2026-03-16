// scripts/symlink-project-docs.ts
// Copies project docs into _project-docs/<id>/ so the portfolio site can fetch and
// display them when a project card is clicked. We intentionally copy instead of using
// symlinks because GitHub Pages artifact uploads do not reliably preserve symlink targets.

import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'fs'
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

  rmSync(docsDir, { recursive: true, force: true })
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
      copy(readmeSrc, readmeDst, folderName, 'README.md')
    }

    // ROADMAP.md (or whatever roadmapFile is in config)
    const roadmapSrc = resolve(localBase, project.roadmapFile || 'ROADMAP.md')
    const roadmapDst = resolve(projectDocsDir, 'ROADMAP.md')
    if (existsSync(roadmapSrc)) {
      copy(roadmapSrc, roadmapDst, folderName, project.roadmapFile || 'ROADMAP.md')
    }

    // specsFile
    const specsSrc = resolve(localBase, project.specsFile || 'project_specs.md')
    const specsDst = resolve(projectDocsDir, 'project_specs.md')
    if (existsSync(specsSrc)) {
      copy(specsSrc, specsDst, folderName, 'project_specs.md')
    }

    // architectureFile
    const archSrc = resolve(localBase, project.architectureFile || 'ARCHITECTURE.md')
    const archDst = resolve(projectDocsDir, 'ARCHITECTURE.md')
    if (existsSync(archSrc)) {
      copy(archSrc, archDst, folderName, 'ARCHITECTURE.md')
    }
  }
  console.log('[symlink-project-docs] Done. Docs are copied under _project-docs/<folder>/')
}

function copy(src: string, dst: string, projectId: string, label: string) {
  try {
    copyFileSync(src, dst)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.warn(`[symlink-project-docs] ${projectId}/${label}: ${msg}`)
  }
}

run()
