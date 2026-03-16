# Meridian Whisper Specifications

## Project Vision

A voice-first control system that eliminates keyboard typing by enabling complete voice control of your computer and AI IDE. Meridian Whisper is the open-source core of the Meridian voice control suite, delivering best-in-class voice control for power users who want hands-free productivity, privacy-focused local processing, and seamless integration with development workflows.

## Current Status

- **Version:** v0.9.0 (Pre-release / Beta)
- **Completion:** 85% complete
- **Last Updated:** January 2026
- **Availability:** Private (preparing for public release)

## Technology Stack

- **Backend:** Python 3.10+ — Core application logic, transcription, parsing, execution
- **Speech Recognition:** OpenAI Whisper (via faster_whisper) — Local speech-to-text processing
- **NLP Parsing:** OpenRouter API + Ollama (local fallback) — Intent extraction from natural language
- **API Framework:** FastAPI — HTTP API server for programmatic access
- **UI Components:** PySimpleGUI, System Tray (pystray) — User interface and management
- **System Integration:** Windows PowerShell, subprocess, pyautogui, keyboard — System control and automation
- **Build Tools:** CMake, Visual Studio Build Tools — For whisper.cpp compilation (if building from source)
- **Testing:** pytest — Test framework
- **External APIs:** OpenRouter API (optional, for LLM parsing), Ollama (optional, for local LLM)
- **Hosting:** Self-hosted (local Windows machine)
- **AI Tools Used:** Cursor (Claude 3.5 for scaffolding and development)

## Key Features (Completed)

- ✅ **Core Architecture** — Transcription, parsing, and execution layers fully implemented
- ✅ **Local Whisper Transcription** — Offline speech-to-text using OpenAI Whisper models
- ✅ **Intelligent Command Parsing** — Hybrid rule-based and LLM-powered intent extraction
- ✅ **System Control** — Open applications, navigate folders, execute system commands through voice
- ✅ **AI IDE Integration** — Direct integration with Cursor IDE for voice-controlled prompting
- ✅ **User Interface** — System tray icon, global hotkey (Ctrl+Alt+Space), wake-word activation ("Hey Cursor")
- ✅ **HTTP API Server** — Local FastAPI server with authentication, rate limiting, and secure token management
- ✅ **Security Hardening** — Application whitelisting, input validation, path sanitization, secure execution model
- ✅ **Audio Feedback System** — Multi-state sound feedback (activation, recording, success, error)
- ✅ **Text-to-Speech Integration** — Windows SAPI integration for reading clipboard, selection, and text aloud
- ✅ **Enhanced Custom Commands** — Natural language aliases, application synonyms, phrase replacements
- ✅ **Direct AI Model Query** — Voice-activated LLM queries with TTS response integration
- ✅ **Custom Mappings & Synonyms** — User-editable JSON configuration for personalized command recognition
- ✅ **Logging & Dry-Run Mode** — Comprehensive JSON logging and command preview without execution
- ✅ **API Management GUI** — Visual interface for server control, token management, and monitoring
- ✅ **Comprehensive Testing** — Test suite covering major components
- ✅ **Documentation** — README, ARCHITECTURE.md, ROADMAP.md complete

## Features In Progress

- 🔄 **Voice Command History** (ETA: ~20 minutes) — Command replay and review functionality
- 🔄 **Standalone Executable Packaging** (ETA: ~60 minutes) — PyInstaller build for easy distribution
- 🔄 **Final Integration & QA** (ETA: 2-3 days) — Comprehensive testing and polish before release
- 🔄 **Performance Optimization** (ETA: 1 week) — CPU-only processing improvements and latency reduction
- 🔄 **Enhanced Error Handling** (ETA: 2-3 days) — Better error messages and recovery mechanisms

## Planned Features

- 📋 **Cross-Platform Support (macOS)** — Expand beyond Windows to macOS developers
- 📋 **Cross-Platform Support (Linux)** — Complete cross-platform coverage for Linux developers
- 📋 **Plugin Architecture** — Enable community contributions and custom integrations
- 📋 **Enhanced IDE Integrations** — Support for VS Code, IntelliJ, and other IDEs
- 📋 **Advanced Wake-Word Customization** — Custom wake-words and multi-language support
- 📋 **Streaming Transcription Display** — Real-time transcription feedback overlay (deferred from MVP)
- 📋 **VAD-based Silence Detection** — Automatic voice-activated start/stop (deferred from MVP)
- 📋 **Command Flow Automation** — Multi-step command sequences and workflow automation
- 📋 **Meridian Pro Launch** — Paid version with advanced features (vision, hearing, learning systems)
- 📋 **Community Marketplace** — Platform for sharing custom commands, flows, and integrations

## Key Decisions

- **Why Local Whisper Processing?** Privacy and low latency are critical. All transcription happens locally using Whisper models, ensuring no audio data leaves the user's machine. This also eliminates ongoing API costs and enables offline operation.

- **Why Hybrid Parsing (Rule-based + LLM)?** Balance of speed and accuracy. Rule-based parsing handles common commands instantly, while LLM fallback handles complex or ambiguous natural language. This reduces API costs and latency while maintaining flexibility.

- **Why System Tray + Hotkey UI?** Minimal footprint and always accessible. A full GUI would add complexity and resource usage. The system tray provides essential controls without cluttering the desktop, and global hotkeys enable instant activation from anywhere.

- **Why CPU-Only Optimization?** Accessibility and portability. Many laptops don't have discrete GPUs, and CPU-only processing ensures the system works on any Windows machine without special hardware requirements.

- **Why Open-Source Core with Premium Ecosystem?** Community building and sustainable business model. The open-source core builds trust and community, while premium features (Meridian Pro) provide revenue for advanced development. This approach serves both individual users and enterprise customers.

## Success Metrics

- **User Growth:**
  - 100+ GitHub stars within 6 months of public release
  - 50+ active users within 3 months
  - 10+ community contributors within 6 months

- **Feature Adoption:**
  - 80% of users use custom mappings feature
  - 60% of users use TTS features
  - 40% of users use API endpoints

- **Performance Benchmarks:**
  - <2 second transcription latency (CPU-only, tiny model)
  - 95%+ command recognition accuracy
  - <100ms execution latency for system commands

- **Technical Quality:**
  - 80%+ test coverage
  - <10 known bugs at any time
  - All security vulnerabilities addressed within 48 hours

- **Community Feedback:**
  - 4.0+ average rating in user feedback
  - <5 critical bugs reported per month
  - 10+ feature requests from community per quarter

- **Business Metrics (Meridian Pro):**
  - 10+ Pro users within 6 months of launch
  - 20% conversion rate from OSS to Pro

## Known Limitations

- **Platform Support:** Currently Windows-only. macOS and Linux support planned but not yet implemented.

- **Performance:** CPU-only processing limits transcription speed (1-3 seconds for typical commands). GPU acceleration would improve speed but reduces compatibility.

- **Model Size Trade-offs:** Larger Whisper models provide better accuracy but significantly increase latency on CPU-only systems. Users must choose between speed (tiny/base) and accuracy (small/medium/large).

- **UI Automation Brittleness:** Some features depend on window titles and UI structure, which can break with application updates. CLI integration is preferred where possible.

- **Single-User System:** Designed for single-user local installation. Multi-user support would require significant architectural changes.

- **Limited IDE Integration:** Currently optimized for Cursor IDE. Support for other IDEs (VS Code, IntelliJ) is planned but requires additional development.

- **Deferred Features:** Partial transcription display and VAD-based silence detection were deferred from MVP to focus on core functionality. These are planned for post-MVP release.

- **No Cloud Sync:** Configuration and command history are local-only. Cloud sync for multi-device support is a future enhancement.

- **Limited Language Support:** Currently optimized for English. Multi-language support requires language-specific models and training.

## Important URLs/Credentials

- **GitHub Repository:** [To be added when public]
- **API Documentation:** `http://localhost:8000/docs` (when API server is running)
- **Health Check Endpoint:** `http://localhost:8000/health`
- **OpenRouter API:** Requires API key (set via `OPENROUTER_API_KEY` environment variable)
- **Ollama:** Optional local LLM (requires separate installation)

---

*Initial structure generated by Cursor AI, reviewed and refined manually.*
