# Meridian Whisper

Voice-first system and AI IDE control using local Whisper and NLP parsing—eliminate typing through intelligent voice commands.

## Table of Contents

- [Meridian Whisper](#meridian-whisper)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Tech Stack](#tech-stack)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Step-by-Step Setup](#step-by-step-setup)
  - [Usage / Getting Started](#usage--getting-started)
    - [Basic Usage: Voice Command Listener](#basic-usage-voice-command-listener)
    - [Command Line Options](#command-line-options)
    - [API Server](#api-server)
    - [Running Tests](#running-tests)
  - [Architecture Overview](#architecture-overview)
  - [API Documentation](#api-documentation)
    - [Base URL](#base-url)
    - [Authentication](#authentication)
    - [Endpoints](#endpoints)
      - [`GET /health`](#get-health)
      - [`POST /transcribe`](#post-transcribe)
      - [`POST /command`](#post-command)
  - [Configuration](#configuration)
    - [Model Configuration](#model-configuration)
    - [Hotkey Configuration](#hotkey-configuration)
    - [Custom Mappings \& Synonyms](#custom-mappings--synonyms)
    - [Logging Configuration](#logging-configuration)
  - [Contributing](#contributing)
  - [Roadmap](#roadmap)
  - [License](#license)
  - [FAQ](#faq)

## Overview

Meridian Whisper helps you control your system and AI IDE entirely through voice commands, eliminating the need for keyboard typing. Whether you want to open applications, navigate folders, or interact with Cursor IDE, you can simply speak your intent and the system handles the rest.

**Why Meridian Whisper exists:**
- Typing long prompts and commands is physically taxing
- Voice control enables hands-free productivity
- Local processing ensures privacy and low latency
- Power users need precise, customizable voice automation

**Who it's for:**
- Developers who want to reduce typing fatigue
- Power users seeking efficient system automation
- Anyone who prefers voice interaction over keyboard input
- Users working with AI IDEs who want to speak instead of type

## Key Features

- **Local Whisper Transcription** — Offline speech-to-text using OpenAI Whisper models, running entirely on your machine
- **Intelligent Command Parsing** — Hybrid rule-based and LLM-powered intent extraction that understands natural language commands
- **System Control** — Open applications, navigate folders, execute system commands through voice
- **AI IDE Integration** — Direct integration with Cursor IDE for voice-controlled prompting and navigation
- **Real-time Transcription** — Streaming transcription with partial results displayed in an overlay
- **Wake-Word Activation** — Offline keyword detection ("Hey Cursor") to trigger listening without hotkeys
- **HTTP API Server** — Local FastAPI server for programmatic transcription and command execution
- **Custom Mappings** — User-editable synonym mappings for personalized command recognition
- **Dry-Run Mode** — Preview commands before execution to ensure accuracy
- **Comprehensive Logging** — JSON logging of all transcripts, intents, and executions for analysis

## Tech Stack

- **Language:** Python 3.10+
- **Speech Recognition:** OpenAI Whisper (via whisper.cpp)
- **Streaming:** whisper_streaming for real-time microphone input
- **NLP Parsing:** OpenRouter API (with local LLM fallback support)
- **API Framework:** FastAPI
- **UI Components:** PySimpleGUI, System Tray integration
- **System Integration:** Windows PowerShell, subprocess, pyautogui
- **Build Tools:** CMake, Visual Studio Build Tools
- **Testing:** pytest

## Installation

### Prerequisites

- Windows 10 or later
- Python 3.10 or higher
- CMake (for building whisper.cpp)
- Visual Studio Build Tools (Desktop development with C++)
- Git

### Step-by-Step Setup

1. **Clone the repository:**
```powershell
git clone <repo-url>
cd meridian-whisper
```

2. **Create a virtual environment:**
```powershell
python -m venv .venv
& .\.venv\Scripts\Activate.ps1
```

3. **Install dependencies:**
```powershell
pip install -r requirements.txt
```

4. **Set environment variables:**
```powershell
$Env:OPENROUTER_API_KEY = "your_api_key"
```

5. **Build whisper.cpp (if needed):**
Follow the whisper.cpp build instructions for Windows. The project expects whisper.cpp to be available in your system PATH or configured appropriately.

## Usage / Getting Started

### Basic Usage: Voice Command Listener

1. **Launch the listener:**
```powershell
start_listener.bat
```

2. **Activate voice input:**
   - Hold **Ctrl+Alt+Space**
   - Speak your command (e.g., "open notepad" or "open cursor in the personal-projects folder")
   - Release the hotkey to execute

3. **Example commands:**
   - "open brave browser"
   - "open cursor in the personal-projects folder"
   - "open notepad"
   - "navigate to downloads folder"

### Command Line Options

Preview commands without executing them:
```powershell
python ui_hotkey.py --dry-run
```

Specify a custom log file path:
```powershell
python ui_hotkey.py --log-path logs/custom.jsonl
```

Combine options:
```powershell
python ui_hotkey.py --dry-run --log-path test.jsonl
```

### API Server

**Option 1: Using API Management GUI (Recommended)**

Launch the visual management interface:
```powershell
start_api_gui.bat
```

The GUI provides:
- One-click server start/stop/restart
- Secure bearer token generation and rotation
- Real-time server status monitoring
- Activity logging and system log viewing

**Option 2: Manual Command Line**

Start the API server manually:
```powershell
& .\.venv\Scripts\Activate.ps1
uvicorn api_server:app --host 127.0.0.1 --port 8000
```

**Example API Requests:**

Get server status:
```bash
curl -X GET "http://localhost:8000/health"
```

Transcribe audio file:
```bash
curl -X POST "http://localhost:8000/transcribe" \
  -H "Authorization: Bearer <your_token>" \
  -F "file=@path/to/audio.wav"
```

Parse voice command:
```bash
curl -X POST "http://localhost:8000/command" \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"open notepad\"}"
```

### Running Tests

```powershell
pytest
```

## Architecture Overview

Meridian Whisper follows a modular architecture with clear separation between transcription, parsing, and execution layers.

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                       │
│  (System Tray / Hotkey / Wake-Word / API GUI)           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Transcription Layer                        │
│  (Whisper.cpp + whisper_streaming)                      │
│  • Real-time microphone capture                          │
│  • Streaming speech-to-text                             │
│  • Partial transcription display                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Command Parsing Layer                      │
│  (Rule-based + LLM Intent Parser)                       │
│  • Rule-based pattern matching                          │
│  • LLM fallback for complex intents                      │
│  • Custom mappings & synonym expansion                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Execution Engine                            │
│  (System Actions + IDE Integration)                      │
│  • Application launching                                │
│  • File system navigation                               │
│  • Cursor IDE integration                               │
│  • System command execution                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Logging & Monitoring                        │
│  (JSON Lines logging + API activity tracking)            │
└─────────────────────────────────────────────────────────┘
```

**Data Flow:**

1. **Voice Input** → User speaks while holding hotkey or after wake-word detection
2. **Transcription** → Audio stream processed by Whisper model, text extracted
3. **Parsing** → Text analyzed for intent (action, target, parameters)
4. **Execution** → Intent mapped to system action and executed
5. **Logging** → Transcript, intent, and execution result logged to JSON file

**Key Components:**

- **`ui_hotkey.py`** — Global hotkey listener, transcription coordinator, and main entry point
- **`command_parser.py`** — Rule-based and LLM fallback parser for intent extraction
- **`execution_engine.py`** — Maps intents to system actions (apps, folders, IDE commands)
- **`llm_intent_parser.py`** — LLM-based intent parser using OpenRouter API
- **`api_server.py`** — FastAPI server exposing transcription and command endpoints

## API Documentation

Meridian Whisper provides a local HTTP API for programmatic access to transcription and command parsing.

### Base URL
```
http://localhost:8000
```

### Authentication
All endpoints (except `/health`) require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_token>
```

Generate tokens via the API Management GUI or configure in the server settings.

### Endpoints

#### `GET /health`
Check server status.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

#### `POST /transcribe`
Transcribe an audio file to text.

**Request:**
- Method: `POST`
- Headers: `Authorization: Bearer <token>`
- Body: `multipart/form-data` with `file` field containing audio file

**Response:**
```json
{
  "text": "open notepad",
  "language": "en"
}
```

#### `POST /command`
Parse a text command and return intent structure.

**Request:**
- Method: `POST`
- Headers: 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- Body:
```json
{
  "text": "open notepad"
}
```

**Response:**
```json
{
  "intent": "open",
  "target": "notepad",
  "confidence": 0.95
}
```

For complete API documentation, see the interactive docs at `http://localhost:8000/docs` when the server is running.

## Configuration

### Model Configuration
Edit `ui_hotkey.py` to change the Whisper model size:
```python
WhisperModel("tiny.en", ...)  # Change to "base.en", "small.en", etc.
```

### Hotkey Configuration
Modify the hotkey in `ui_hotkey.py`:
```python
keyboard.wait("ctrl+alt+space")  # Change to your preferred combination
```

### Custom Mappings & Synonyms
Edit `mappings.json` in the project root to customize command recognition:

```json
{
  "open": ["launch", "start", "run"],
  "browser": ["chrome", "edge", "firefox", "brave"],
  "notepad": ["text editor", "editor"]
}
```

Set `MAPPINGS_PATH` environment variable to use a custom mappings file:
```powershell
$Env:MAPPINGS_PATH = "C:\path\to\custom_mappings.json"
```

Restart the listener after making changes to load updated mappings.

### Logging Configuration
- Default log location: `logs/meridian.jsonl`
- Customize via `--log-path` command line option
- Format: JSON Lines (one JSON object per line)

## Contributing

Meridian Whisper is an open-source project. Contributions are welcome!

**How to contribute:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`pytest`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

**Areas where contributions are especially welcome:**
- Additional command parsers and intent handlers
- Support for other IDEs and editors
- Performance optimizations
- Documentation improvements
- Test coverage expansion

## Roadmap

### Project Status

**Status:** 85% Complete (Core features shipped, preparing for public release)

**Visual Progress:**
```
[████████████████░░] 85%
```

**Completed Features:**
- Core architecture (transcription, parsing, execution layers)
- User interface (system tray, global hotkey, wake-word activation)
- HTTP API server with authentication and rate limiting
- Security hardening (application whitelisting, input validation)
- User Stories Implementation (all 4 phases: audio feedback, TTS, enhanced commands, AI queries)
- Advanced features (custom mappings, logging, dry-run mode, API management GUI)
- Comprehensive testing and documentation

**In Progress:**
- Voice Command History (ETA: ~20 minutes)
- Standalone Executable Packaging (ETA: ~60 minutes)
- Final Integration & QA (ETA: 2-3 days)
- Performance Optimization (ETA: 1 week)

**Stats:**
- Lines of code: ~5,500 (Python)
- Test coverage: Comprehensive test suite covering major components
- Documentation coverage: 100% (README, ARCHITECTURE.md, ROADMAP.md complete)
- Last updated: January 2024

See [ROADMAP.md](ROADMAP.md) for detailed feature planning.

**Current Focus:**
- Enhanced wake-word detection accuracy
- Expanded IDE integration support
- Performance optimizations for CPU-only systems

**Planned Features:**
- Multi-language support
- Custom flow automation
- Enterprise deployment options
- Community marketplace for command flows

## License

[License type to be determined - add when decided]

## FAQ

**Q: Does this work offline?**  
A: Yes! Whisper transcription runs entirely locally. Only the LLM intent parser requires an internet connection (via OpenRouter API). You can configure a local LLM fallback for fully offline operation.

**Q: What Whisper models are supported?**  
A: Any Whisper model compatible with whisper.cpp. The default is `tiny.en` for speed, but you can use `base.en`, `small.en`, `medium.en`, or `large-v2` for better accuracy.

**Q: Can I use this with other IDEs besides Cursor?**  
A: Yes! The execution engine is modular. You can extend it to support VS Code, IntelliJ, or any IDE with CLI or automation capabilities.

**Q: How do I add custom commands?**  
A: Edit `mappings.json` to add synonyms, and extend `execution_engine.py` to add new action handlers.

**Q: Is my voice data sent to external services?**  
A: No. All transcription happens locally using Whisper. Only the command text (after transcription) is sent to the LLM parser if you're using OpenRouter API. You can use a local LLM for complete privacy.

**Q: Why is transcription slow on my machine?**  
A: Whisper models are computationally intensive. Try using a smaller model (`tiny.en` or `base.en`) or ensure you have sufficient CPU resources available.

**Q: Can I change the wake word from "Hey Cursor"?**  
A: Yes, the wake-word detection is configurable. Check the wake-word configuration in the codebase.

**Q: How do I integrate this with Cursor IDE?**  
A: Add a custom tool in Cursor:
   - Name: Voice Control Listener
   - Command: `start_listener.bat`

---

*Initial structure generated by Cursor AI, reviewed and refined manually.*
