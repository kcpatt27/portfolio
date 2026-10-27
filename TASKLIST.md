# Tasklist — portfolio

One tasklist per repo (like README / ROADMAP / tickets). Move finished items to Done.

## Now

- [ ] **Design bake-off** — replace the current visual design via independent
      directions from local models (`rq10b`, `gemma4:12b`, `astrea`, `hivemind`,
      `psyonic cetacean`), judged per-criterion by **eyewright**.
      Prompt: `notes-vault/ideas/2026-10-17-portfolio-bakeoff-prompt.md`.
      Current look (colours, layout, word choice, project showcase) does not
      represent the operator's current skills.
- [ ] **Do not commit a PC build's `_project-docs`** - the copy step wipes and
      re-copies from each project's `localPath`. On the PC, `sqwease` is not
      checked out, so its README/ARCHITECTURE are dropped (the script warns).
      Build and deploy from the laptop, or vendor the allowed docs. Verified
      2026-10-27: `npm run build` passes the publication gate, but rewrites four
      tracked generated files.
- [ ] **Purge `.taskmaster/` from history** — contains the old services PRD and
      pricing ($2k/$3.5k/$5k). Needs an explicit go for a second history rewrite.

## Done (2026-10-15 → 17)

- [x] Removed the private-project PRD/roadmap leak; pruned config to public repos
- [x] Scrubbed the leak from git history (`git filter-repo` + force-push)
- [x] Fail-closed publication gate (`release` metadata, default-deny)
- [x] CI + live smoke suite (10 checks, including leak checks)
- [x] Services surface removed (`web-dev/`, `examples/`, Google Forms)
- [x] `vision.html` + `timeline.html`; `roadmaps.html` removed
- [x] Config generated from `shared-docs` (publishability in frontmatter)
- [x] Organic hero motion; "cyberpunk" wording removed
