// scripts/refresh-status.ts
// Refreshes project facts in metadata/projects.json from GitHub, PyPI, and npm.
// Run by the weekly refresh-status workflow, which opens a pull request with the
// diff. Status and version are derived, never invented: a manual
// statusOverride wins, otherwise repository visibility decides.
//
// Run locally with: npm run refresh

import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

interface Project {
  id: string
  name: string
  repo: string
  pypi: string
  npm: string
  statusOverride: string
  status: string
  statusNote: string
  version: string
  visibility: string
  release: string
  pypiVersion: string
  npmVersion: string
  npmDownloads: number | null
  checked: string
}

const root = process.cwd()
const path = resolve(root, 'metadata/projects.json')

const today = new Date().toISOString().slice(0, 10)
const userAgent = { 'user-agent': 'portfolio-refresh' }

function headersFor(url: string): Record<string, string> {
  const headers: Record<string, string> = { ...userAgent }
  if (new URL(url).hostname === 'api.github.com') {
    headers.accept = 'application/vnd.github+json'
    if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }
  return headers
}

async function getJson(url: string): Promise<{ status: number; data: any }> {
  const response = await fetch(url, { headers: headersFor(url) })
  if (response.status === 404) return { status: 404, data: null }
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`)
  return { status: response.status, data: await response.json() }
}

function withV(value: string): string {
  return /^\d/.test(value) ? `v${value}` : value
}

async function main(): Promise<void> {
  const data = JSON.parse(readFileSync(path, 'utf8')) as { projects: Project[] }
  const changes: string[] = []

  for (const project of data.projects) {
    let visibility = project.visibility
    let release = project.release
    let pypiVersion = project.pypiVersion
    let npmVersion = project.npmVersion
    let npmDownloads = project.npmDownloads

    try {
      if (project.repo) {
        const repo = await getJson(`https://api.github.com/repos/${project.repo}`)
        if (repo.status === 404) {
          visibility = 'unavailable'
          console.warn(`[refresh] ${project.id}: repository not readable without auth; keeping the manual status`)
        } else {
          visibility = repo.data.visibility === 'public' ? 'public' : 'private'
        }

        const latest = await getJson(`https://api.github.com/repos/${project.repo}/releases/latest`)
        release = latest.status === 404 ? '' : String(latest.data.tag_name ?? '')
      }

      if (project.pypi) {
        const pypi = await getJson(`https://pypi.org/pypi/${project.pypi}/json`)
        pypiVersion = String(pypi.data.info.version)
      }

      if (project.npm) {
        const npm = await getJson(`https://registry.npmjs.org/${project.npm}/latest`)
        npmVersion = String(npm.data.version)
        const downloads = await getJson(`https://api.npmjs.org/downloads/point/last-month/${project.npm}`)
        npmDownloads = Number(downloads.data.downloads)
      }
    } catch (error) {
      console.warn(`[refresh] ${project.id}: ${(error as Error).message}; keeping previous facts`)
      continue
    }

    const status = project.statusOverride
      ? project.statusOverride
      : visibility === 'public'
        ? 'Public'
        : visibility === 'private'
          ? 'Private'
          : project.status
    const version = pypiVersion ? withV(pypiVersion) : npmVersion ? withV(npmVersion) : release || project.version

    const before = { status: project.status, version: project.version, visibility: project.visibility, release: project.release, pypiVersion: project.pypiVersion, npmVersion: project.npmVersion, npmDownloads: project.npmDownloads }
    const after = { status, version, visibility, release, pypiVersion, npmVersion, npmDownloads }
    const changed = Object.keys(after).filter((key) => before[key as keyof typeof before] !== after[key as keyof typeof after])
    if (changed.length > 0) {
      changes.push(`${project.id}: ${changed.map((key) => `${key} ${JSON.stringify(before[key as keyof typeof before])} -> ${JSON.stringify(after[key as keyof typeof after])}`).join(', ')}`)
    }

    project.status = status
    project.version = version
    project.visibility = visibility
    project.release = release
    project.pypiVersion = pypiVersion
    project.npmVersion = npmVersion
    project.npmDownloads = npmDownloads
    if (changed.length > 0) project.checked = today
  }

  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)

  if (changes.length === 0) {
    console.log('Refresh: no fact changes')
  } else {
    console.log('Refresh:')
    for (const change of changes) console.log(`  - ${change}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
