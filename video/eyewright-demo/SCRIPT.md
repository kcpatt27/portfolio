# eyewright demo — 75-second script

Tone: calm, technical, no hype. The product is a decision layer, not a chatbot.

## 0:00–0:08 — Cold open

**Visual:** case-study hero or a clean terminal.

**Narration:** “An agent can propose an action. The harder question is whether the system should trust it. eyewright is the decision step: a local committee behind one typed call.”

## 0:08–0:20 — The surface

**Visual:** terminal.

```powershell
eyewright --version
eyewright --help
```

**Narration:** “It ships as one Python package with four surfaces: Python, CLI, HTTP, and MCP. Same policy, same typed result.”

## 0:20–0:40 — A real gate

**Visual:** run the real gate against a disposable artifact.

```powershell
eyewright gate `
  --state "The artifact is a 42-line README with install, usage, and a limits section. The test command passes locally." `
  --question "Is this artifact done enough to accept?" `
  --config examples/gate.json
```

**Narration:** “The main local eye returns a probability. If it is confident, it accepts or rejects. If it is in the uncertain band, the consult eyes fire only there. The trace tells you which path ran and why.”

**Visual:** highlight `p_done`, `decision`, and `trace.consults`; keep the window still for two seconds.

## 0:40–0:55 — A typed decision

**Visual:** a choice question with two options.

```powershell
eyewright ask `
  --state "The README is ready except the limitations section is missing. The deployment is tomorrow." `
  --question "Should the release be accepted, revised, or held?" `
  --choices '{\"accept\":\"ship as-is\",\"revise\":\"fix the limits section first\",\"hold\":\"stop the release\"}' `
  --config examples/gate.json
```

**Narration:** “The output is typed, not a paragraph. The caller gets a decision, a confidence, and the trace. A schema, a policy, or a test still decides what happens next.”

## 0:55–1:05 — Local-first boundary

**Visual:** show the config with the main eye local; if a cloud eye is present, show it is opt-in and labelled.

**Narration:** “The default path is local. A cloud eye is an explicit opt-in, and the egress trade is in the docs. The point is not to hide the judgment in a model; it is to make the judgment inspectable.”

## 1:05–1:15 — Close

**Visual:** PyPI page, then the case study/diagram.

**Narration:** “eyewright is published on PyPI, currently in beta, with the source going public after the demo. The case study covers the gate, the four surfaces, and the limits. Links below.”

**End card:** `pypi.org/project/eyewright` · `kcpatterson27@gmail.com`

## Edit notes

- Cut dead time between commands; keep the trace readable.
- Add captions for the command lines.
- Do not speed up the trace so much that it becomes unreadable.
- Keep the full trace in the description or a linked gist if it is long.
