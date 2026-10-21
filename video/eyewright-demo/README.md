# eyewright demo — recording kit

Status: **not recorded on this machine**. The installed PyPI package is present (`eyewright 0.4.0`), but the demo needs the private source tree's `examples/gate.json`, the local `laya-serve` endpoint, and the configured decision models. This machine has generic Ollama models only, no `laya` service, and no source checkout, so a genuine run cannot be captured here.

This folder is the ready-to-record package: scene plan, narration, commands, and a capture checklist. Once the demo environment is available (or the repo is flipped and cloned), this can be recorded in one sitting.

## What the recording must show

1. One real local decision through `eyewright gate` with a trace.
2. One typed `ask` call, ideally a choice or scale question.
3. The four surfaces: Python, CLI, HTTP, MCP (show, do not fake).
4. The local-first boundary and the opt-in cloud eye.
5. A clean close: PyPI, GitHub, and the one-line value proposition.

Do **not** record a mocked output, a static slide pretending to be a terminal, or a path containing private data. If the local services are down, record the failure and the trace; that is more credible than a fake success.

## Environment

- Source checkout with `examples/gate.json` and the supervisor.
- `laya-serve` on `127.0.0.1:8000` with the typed-decisions checkpoint.
- Ollama on `127.0.0.1:11434` with the configured consult model.
- A clean terminal profile, 18–20 pt font, dark warm background, no personal paths in the prompt.
- 1920×1080 or 2560×1440, 30 or 60 fps, microphone tested.
- Capture: OBS Studio (preferred) or Windows Xbox Game Bar (`Win+G`). Record to MP4; do not upload until the trace is checked.

## Before recording

```powershell
eyewright --version
python -m pip show eyewright
Test-NetConnection 127.0.0.1 -Port 8000
Test-NetConnection 127.0.0.1 -Port 11434
```

Replace any personal path in the terminal title/prompt. Use a disposable workspace under the repo, never a home directory with client data.

## After recording

- Add the Loom/YouTube link and GitHub link to `work/eyewright.html` and the Work record.
- Add a poster frame and a 1–2 sentence caption.
- Confirm reduced-motion/site links are unaffected.
- Update `NEXT.md`.

## Files

- `SCRIPT.md` — 75-second shot list and narration.
- `commands.ps1` — rehearsal commands; edit the config path to the real demo config.
- `CHECKLIST.md` — pre/post recording checks.
