// scripts/smoke.mjs — post-deploy smoke check.
// Verifies the live site serves, and that private-project PRDs stay gone.
// Uses GET (HEAD is flaky on GitHub Pages) with a small retry.

const checks = [
  { name: 'canonical site', url: 'https://kcpatt27.github.io/portfolio/', expect: 200 },
  { name: 'docs viewer', url: 'https://kcpatt27.github.io/portfolio/docs.html', expect: 200 },
  { name: 'vision page', url: 'https://kcpatt27.github.io/portfolio/vision.html', expect: 200 },
  { name: 'timeline page', url: 'https://kcpatt27.github.io/portfolio/timeline.html', expect: 200 },
  { name: 'services surface removed', url: 'https://kcpatt27.github.io/portfolio/web-dev/', expect: 404 },
  { name: 'roadmaps page removed', url: 'https://kcpatt27.github.io/portfolio/roadmaps.html', expect: 404 },
  { name: 'public doc serves', url: 'https://kcpatt27.github.io/portfolio/_project-docs/global-info-portal/README.md', expect: 200 },
  { name: 'leak check: savant-insights PRD', url: 'https://kcpatt27.github.io/portfolio/_project-docs/savant-insights/project_specs.md', expect: 404 },
  { name: 'leak check: nextdish roadmap', url: 'https://kcpatt27.github.io/portfolio/_project-docs/nextdish/ROADMAP.md', expect: 404 },
  { name: 'leak check: meridian-whisper roadmap', url: 'https://kcpatt27.github.io/portfolio/_project-docs/meridian-whisper/ROADMAP.md', expect: 404 },
  { name: 'leak check: taskmaster scratch', url: 'https://kcpatt27.github.io/portfolio/.taskmaster/tasks/tasks.json', expect: 404 },
]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function statusOf(url) {
  const res = await fetch(url, { method: 'GET', redirect: 'follow' })
  return res.status
}

async function withRetry(check, attempts = 3) {
  let last = 'no attempt'
  for (let i = 0; i < attempts; i += 1) {
    try {
      const status = await statusOf(check.url)
      last = status
      if (status === check.expect) return { ok: true, status }
    } catch (error) {
      last = error.message
    }
    await sleep(1500)
  }
  return { ok: false, status: last }
}

let failed = 0
for (const check of checks) {
  const { ok, status } = await withRetry(check)
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${status} (want ${check.expect}) ${check.name}`)
  if (!ok) failed += 1
}

if (failed > 0) {
  console.error(`\n${failed} smoke check(s) failed.`)
  process.exit(1)
}
console.log('\nAll smoke checks passed.')
