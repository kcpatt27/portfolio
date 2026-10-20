// scripts/check-links.mjs
// Local-only link integrity: every relative href/src must exist, and every
// same-page #anchor must have a matching id. External URLs are checked by the
// live smoke workflow, not here.

import { readFileSync, existsSync } from 'fs'
import { dirname, join, resolve } from 'path'

const root = process.cwd()
const pages = ['index.html', 'timeline.html', 'vision.html', 'docs.html', 'resume.html', '404.html', 'work/global-info-portal.html', 'work/sqwease.html', 'work/memvid-mcp.html']
const errors = []

for (const page of pages) {
  const path = join(root, page)
  if (!existsSync(path)) continue
  const html = readFileSync(path, 'utf8')
  const hrefs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1])

  for (const href of hrefs) {
    if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('data:')) continue
    if (href.includes("'") || href.includes('+') || href.includes('${')) continue
    if (href.startsWith('#')) {
      const id = href.slice(1)
      if (id && !new RegExp(`id=["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(html)) {
        errors.push(`${page}: missing anchor target ${href}`)
      }
      continue
    }
    const clean = href.split('#')[0].split('?')[0]
    if (!clean) continue
    const target = clean.startsWith('/') ? resolve(root, clean.slice(1)) : resolve(dirname(path), clean)
    if (!existsSync(target)) errors.push(`${page}: missing local target ${href}`)
  }
}

if (errors.length) {
  console.error('LOCAL LINK CHECK FAILED:')
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}
console.log(`Local link check: OK (${pages.length} pages)`)
