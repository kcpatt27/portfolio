# Tasklist — portfolio

One tasklist per repo (like README / ROADMAP / tickets). Move finished items to Done.

## Now

- [ ] **Final launch pass** - deploy the chosen direction and re-run the live
      smoke suite. The design bake-off is complete (operator, 2026-10-27) and
      will recur periodically; it is not a blocker.
- [ ] **Do not commit a PC build's `_project-docs`** - the copy step wipes and
      re-copies from each project's `localPath`. On the PC, `sqwease` is not
      checked out, so its README/ARCHITECTURE are dropped (the script warns).
      Build and deploy from the laptop, or vendor the allowed docs. Verified
      2026-10-27: `npm run build` passes the publication gate, but rewrites four
      tracked generated files.
- [ ] **Purge `.taskmaster/` from history** - contains the old services PRD and
      pricing ($2k/$3.5k/$5k). Needs an explicit go for a second history rewrite.
      **Live exposure closed 2026-10-27**: the directory was tracked and Pages
      serves dot-directories, so `/.taskmaster/tasks/tasks.json` returned 200.
      Removed from HEAD and verified 404 (`eb5adb5`); the files remain in history.

## Done (2026-10-15 → 17)

- [x] Removed the private-project PRD/roadmap leak; pruned config to public repos
- [x] Scrubbed the leak from git history (`git filter-repo` + force-push)
- [x] Fail-closed publication gate (`release` metadata, default-deny)
- [x] CI + live smoke suite (10 checks, including leak checks)
- [x] Services surface removed (`web-dev/`, `examples/`, Google Forms)
- [x] `vision.html` + `timeline.html`; `roadmaps.html` removed
- [x] Config generated from `shared-docs` (publishability in frontmatter)
- [x] Organic hero motion; "cyberpunk" wording removed
