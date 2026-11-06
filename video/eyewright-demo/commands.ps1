# Rehearsal commands. Edit the config path and state text before recording.
# Run from the eyewright source checkout, not the portfolio repo.

eyewright --version
eyewright --help

eyewright gate `
  --state "The artifact is a 42-line README with install, usage, and a limits section. The test command passes locally." `
  --question "Is this artifact done enough to accept?" `
  --config examples/gate.json

eyewright ask `
  --state "The README is ready except the limitations section is missing. The deployment is tomorrow." `
  --question "Should the release be accepted, revised, or held?" `
  --choices '{\"accept\":\"ship as-is\",\"revise\":\"fix the limits section first\",\"hold\":\"stop the release\"}' `
  --config examples/gate.json

# Optional surfaces if the local server is configured:
# eyewright serve --config examples/gate.json
# curl http://127.0.0.1:8090/health
# eyewright mcp --config examples/gate.json
