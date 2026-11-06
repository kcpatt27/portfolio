// scripts/check-publish.ts
// Fail-closed publication gate. Runs before every build.
//
// Default-deny: a project with no `release` block, a non-public visibility, or
// any commercial flag never reaches the public site. Roadmap/PRD files are never
// published — the site shows a timeline, not a plan.

import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { join, resolve } from 'path'

interface Release {
  visibility?: string
  commercial?: boolean
  publishable?: string[]
  never?: string[]
}

interface Project {
  id: string
  name?: string
  localPath?: string
  release?: Release
  [key: string]: unknown
}

const root = process.cwd()
const configPath = resolve(root, 'metadata/projects.config.json')
const docsDir = resolve(root, '_project-docs')
const FORBIDDEN = ['ROADMAP.md', 'project_specs.md']
const FORBIDDEN_CONTENT = /\b(roadmap|prds?|project[_ ]specs?|specifications)\b/i

const config = JSON.parse(readFileSync(configPath, 'utf8')) as { projects: Project[] }
const errors: string[] = []

for (const project of config.projects ?? []) {
  const rel = project.release
  if (!rel) {
    errors.push(`${project.id}: missing "release" metadata (default-deny)`)
    continue
  }
  if (rel.visibility !== 'public') {
    errors.push(`${project.id}: visibility="${rel.visibility}" — only "public" projects may appear`)
  }
  if (rel.commercial) {
    errors.push(`${project.id}: commercial=true — must not be published`)
  }

  const publishable = rel.publishable ?? []
  const never = rel.never ?? []

  for (const name of never) {
    if (publishable.includes(name)) errors.push(`${project.id}: "${name}" is listed as both publishable and never`)
  }
  for (const name of FORBIDDEN) {
    if (publishable.includes(name)) {
      errors.push(`${project.id}: "${name}" must not be published (show a timeline, not a roadmap/PRD)`)
    }
  }
  if (publishable.length === 0) {
    errors.push(`${project.id}: publishable is empty — nothing may be copied`)
  }
}

// Belt-and-braces: scan the built output for forbidden filenames (opt-in, post-build).
if (process.argv.includes('--scan-output') && existsSync(docsDir)) {
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (FORBIDDEN.includes(entry.name)) {
        errors.push(`built output contains forbidden file: ${full.replace(root + '\\', '').replace(root + '/', '')}`)
      } else if (entry.name.endsWith('.md')) {
        const text = readFileSync(full, 'utf8')
        if (FORBIDDEN_CONTENT.test(text)) {
          errors.push(`built output contains roadmap/PRD/spec content: ${full.replace(root + '\\', '').replace(root + '/', '')}`)
        }
      }
    }
  }
  walk(docsDir)
}

if (errors.length > 0) {
  console.error('PUBLICATION GATE FAILED:')
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

console.log(`Publication gate: OK (${config.projects.length} public project(s), no roadmap/PRD content)`)
