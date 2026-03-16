# Meridian Whisper Architecture

## System Overview

Meridian Whisper is a voice-first control system that enables users to interact with their computer and AI IDE entirely through spoken commands. The system processes audio input locally using OpenAI Whisper models, extracts user intent through a hybrid parsing approach (rule-based patterns with LLM fallback), and executes commands by interfacing with the Windows operating system and applications like Cursor IDE.

The architecture follows a modular pipeline design: audio capture flows through transcription, intent parsing, and execution layers, with each component operating independently and communicating through well-defined interfaces. This separation allows for easy testing, maintenance, and future enhancements. The system prioritizes local processing for privacy and low latency, running entirely on the user's machine without requiring cloud services for transcription, though it supports optional cloud-based LLM parsing for complex intent extraction.

The system is designed for CPU-only environments, making it accessible to users without discrete GPUs. It provides multiple interaction modes including global hotkeys, wake-word detection, system tray integration, and an HTTP API for programmatic access, ensuring flexibility for different use cases and workflows.

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Layer                               │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │ Global Hotkey │  │ Wake-Word    │  │ System Tray / GUI   │  │
│  │ (Ctrl+Alt+Sp) │  │ ("Hey Cursor")│  │ (API Management)    │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬──────────┘  │
└─────────┼──────────────────┼──────────────────────┼────────────┘
          │                  │                      │
          └──────────────────┴──────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    User Interface Layer                         │
│  (ui_hotkey.py, api_gui.py, wake_word.py)                      │
│  • Hotkey listener and coordination                             │
│  • System tray icon and menu                                    │
│  • Wake-word detection thread                                   │
│  • API management GUI                                           │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Transcription Layer                             │
│  (faster_whisper, mic_transcribe.py, transcribe.py)            │
│  • Real-time microphone capture (sounddevice)                    │
│  • Audio stream processing                                      │
│  • Whisper model inference (CPU-optimized)                      │
│  • Partial transcription streaming                              │
│  • Audio format conversion                                      │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼ (transcript text)
┌─────────────────────────────────────────────────────────────────┐
│                  Command Parsing Layer                          │
│  (command_parser.py, llm_intent_parser.py, config_loader.py)   │
│  • Custom mappings & synonym expansion                          │
│  • Rule-based pattern matching                                  │
│  • LLM-based intent extraction (OpenRouter/Ollama)              │
│  • Intent validation and normalization                           │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼ (structured intent)
┌─────────────────────────────────────────────────────────────────┐
│                  Execution Engine                                │
│  (execution_engine.py)                                          │
│  • Intent-to-action mapping                                      │
│  • Application launching (subprocess)                           │
│  • File system navigation (PowerShell)                           │
│  • IDE integration (Cursor CLI, keystroke simulation)           │
│  • Text-to-speech feedback (TTSManager)                        │
│  • Clipboard operations                                          │
└────────────────────┬───────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Logging & Monitoring                            │
│  (logger.py)                                                     │
│  • JSON Lines logging (transcripts, intents, executions)         │
│  • Error tracking                                                │
│  • Performance metrics                                           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  API Server (Optional)                           │
│  (api_server.py, token_manager.py, api_manager.py)             │
│  • FastAPI HTTP server                                           │
│  • Bearer token authentication                                   │
│  • Rate limiting                                                 │
│  • Audio file transcription endpoint                            │
│  • Command parsing endpoint                                      │
│  • Health check endpoint                                         │
└─────────────────────────────────────────────────────────────────┘
```

## Component Descriptions

### User Interface Layer

**Components:** `ui_hotkey.py`, `api_gui.py`, `wake_word.py`

**Purpose:** Provides multiple entry points for user interaction and coordinates the overall system workflow.

**Technology:** Python 3.10+, `keyboard` library, `pystray` for system tray, `PySimpleGUI` for API management GUI

**Key Responsibilities:**
- Listen for global hotkey combinations (default: Ctrl+Alt+Space)
- Detect wake-word activation ("Hey Cursor") using offline keyword detection
- Display system tray icon with context menu (start/stop, copy transcript, help)
- Provide API management GUI for server control and token management
- Coordinate audio capture initiation and transcription workflow
- Handle user preferences and configuration

**Dependencies:**
- Transcription layer for audio processing
- Command parser for intent extraction
- Execution engine for command execution
- Logger for activity tracking

**Failure Mode:** If the UI layer fails, users can still access the system via the HTTP API. Hotkey detection failure would require restarting the listener process.

---

### Transcription Layer

**Components:** `mic_transcribe.py`, `transcribe.py`, `faster_whisper` integration

**Purpose:** Converts spoken audio into text transcripts using local Whisper models.

**Technology:** `faster_whisper` (Python wrapper for Whisper), `sounddevice` for audio capture, `numpy` for audio processing, `soundfile` for format conversion

**Key Responsibilities:**
- Capture real-time audio from microphone input
- Preprocess audio (sample rate conversion, noise reduction)
- Run Whisper model inference on CPU (optimized for int8 quantization)
- Stream partial transcription results for real-time feedback
- Handle audio format conversion (WAV, MP3, etc.)
- Manage microphone device selection and monitoring

**Dependencies:**
- Whisper model files (downloaded on first use)
- System audio drivers and microphone access
- Sufficient CPU resources for model inference

**Failure Mode:** If transcription fails, the system cannot process voice commands. Fallback options include manual text input via API or clipboard operations. The system logs errors and can retry with different audio devices.

---

### Command Parsing Layer

**Components:** `command_parser.py`, `llm_intent_parser.py`, `config_loader.py`

**Purpose:** Extracts structured intent and parameters from natural language transcripts.

**Technology:** Python, `requests` for API calls, `json` for data structures, OpenRouter API or Ollama CLI for LLM parsing

**Key Responsibilities:**
- Apply custom mappings and synonym expansion from `mappings.json`
- Match transcripts against rule-based patterns for common commands
- Fall back to LLM parsing for complex or ambiguous commands
- Validate and normalize extracted intents
- Handle parsing errors gracefully with fallback strategies
- Support multiple LLM backends (OpenRouter API, local Ollama)

**Dependencies:**
- OpenRouter API key (optional, for cloud LLM)
- Ollama installation (optional, for local LLM)
- Custom mappings configuration file
- Command parser schema definitions

**Failure Mode:** If parsing fails, the system logs the transcript and can fall back to simpler rule-based matching or request user clarification. The system continues operating but may misinterpret complex commands.

---

### Execution Engine

**Components:** `execution_engine.py`, `tts_manager.py`

**Purpose:** Executes system actions based on parsed intents, interfacing with Windows and applications.

**Technology:** Python, `subprocess` for process execution, `pyautogui` for UI automation, `keyboard` for keystroke simulation, `pyperclip` for clipboard operations, Windows PowerShell for system commands

**Key Responsibilities:**
- Map intents to executable actions (open app, navigate folder, type text)
- Launch applications securely using whitelisted application names
- Navigate file system using Windows Explorer or PowerShell
- Integrate with Cursor IDE via CLI commands or keystroke simulation
- Provide text-to-speech feedback for command execution status
- Handle clipboard operations (read, write, copy last transcript)
- Execute web searches and browser automation
- Enforce security constraints (application whitelist, path validation)

**Dependencies:**
- Windows operating system APIs
- Target applications (Cursor, browsers, etc.) installed and accessible
- System permissions for process execution and UI automation
- TTS engine for audio feedback

**Failure Mode:** If execution fails, the system logs the error and provides audio/visual feedback. Critical failures (e.g., security violations) are blocked, while non-critical failures (e.g., app not found) are reported to the user. The system continues operating for subsequent commands.

---

### API Server

**Components:** `api_server.py`, `token_manager.py`, `api_manager.py`

**Purpose:** Provides HTTP API endpoints for programmatic access to transcription and command parsing.

**Technology:** FastAPI, Python 3.10+, HTTP Bearer token authentication, CORS middleware

**Key Responsibilities:**
- Expose REST endpoints for audio transcription and command parsing
- Manage bearer token authentication and validation
- Enforce rate limiting (5 requests per minute per IP)
- Validate file uploads (size, type, security checks)
- Provide health check endpoint for monitoring
- Restrict CORS to localhost only for security
- Log API activity and errors

**Dependencies:**
- FastAPI framework
- Token management system
- Transcription and parsing layers (shared with main application)
- Network access (localhost only)

**Failure Mode:** If the API server fails, the main hotkey-based interface continues operating independently. API failures are logged and return appropriate HTTP error codes. The server can be restarted via the API management GUI.

---

### Logging & Monitoring

**Components:** `logger.py`

**Purpose:** Tracks all system activity for debugging, analysis, and auditing.

**Technology:** Python, JSON Lines format, file I/O

**Key Responsibilities:**
- Log transcripts, intents, and execution results to JSON Lines file
- Track errors and exceptions with context
- Record performance metrics (latency, success rates)
- Support custom log file paths via command-line options
- Enable dry-run mode logging without execution
- Provide structured format for easy parsing and analysis

**Dependencies:**
- File system write permissions
- Sufficient disk space for log files

**Failure Mode:** If logging fails, the system continues operating but loses audit trail. Logging failures are silent to avoid disrupting user workflow.

## Data Model

Meridian Whisper is primarily a processing pipeline rather than a data storage system. However, it manages several key data structures:

### Intent Schema

The system uses a structured intent format for command execution:

```json
{
  "intent": "open_app",
  "target": "notepad",
  "parameters": {},
  "confidence": 0.95
}
```

**Supported Intents:**
- `open` / `open_app` — Launch an application
- `open_folder` — Navigate to a directory
- `type` — Type text without sending
- `type_and_send` — Type text and press Enter
- `send` — Send current input (press Enter)
- `search_web` — Perform web search
- `new_chat` — Start new Cursor chat
- `copy_last` — Copy last transcript to clipboard
- `read_clipboard` — Read clipboard content aloud
- `read_selection` — Read selected text aloud
- `read_text` — Read specified text aloud
- `query_model` — Query AI model directly
- `help` — Display available commands

### Log Entry Format

All system activity is logged in JSON Lines format:

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "type": "transcript",
  "text": "open notepad",
  "device": "Microphone (Realtek Audio)",
  "duration": 2.5
}
{
  "timestamp": "2024-01-15T10:30:45.456Z",
  "type": "intent",
  "intent": "open_app",
  "target": "notepad",
  "confidence": 0.98
}
{
  "timestamp": "2024-01-15T10:30:45.789Z",
  "type": "execution",
  "intent": "open_app",
  "target": "notepad",
  "success": true,
  "latency_ms": 150
}
```

### Configuration Files

**`mappings.json`** — Custom synonym mappings:
```json
{
  "open": ["launch", "start", "run"],
  "browser": ["chrome", "edge", "firefox", "brave"],
  "notepad": ["text editor", "editor"]
}
```

**Environment Variables:**
- `OPENROUTER_API_KEY` — API key for OpenRouter LLM service
- `OLLAMA_MODEL` — Local Ollama model name (default: "deepseek-r1:1.5b")
- `MAPPINGS_PATH` — Custom path to mappings file
- `DEBUG_PARSER` — Enable debug logging for parser

## Technology Decisions

### Why Whisper.cpp / faster_whisper?

**What was chosen:** Local Whisper model inference using `faster_whisper` (Python wrapper for optimized Whisper implementation)

**Why:**
- **Privacy:** All transcription happens locally; no audio data leaves the user's machine
- **Latency:** Local processing eliminates network round-trip delays
- **Cost:** No per-request API costs for transcription
- **Reliability:** Works offline without internet connectivity
- **CPU Optimization:** `faster_whisper` provides efficient CPU-only inference suitable for laptops without GPUs

**Alternatives considered:**
- **Cloud APIs (Google Speech-to-Text, Azure Speech):** Rejected due to privacy concerns, latency, and ongoing costs
- **WhisperX:** Considered but `faster_whisper` offers better CPU performance
- **Vosk:** Evaluated but Whisper provides superior accuracy for natural language

**Trade-offs:**
- Larger model files (hundreds of MB) vs. cloud API convenience
- CPU processing time (1-3 seconds) vs. instant cloud results
- Model accuracy varies by size (tiny/base/small) requiring user choice

---

### Why Hybrid Parsing (Rule-based + LLM)?

**What was chosen:** Rule-based pattern matching with LLM fallback for complex intents

**Why:**
- **Speed:** Rule-based parsing is instant for common commands
- **Reliability:** Deterministic patterns for predictable commands
- **Cost:** Reduces LLM API calls for simple commands
- **Flexibility:** LLM handles ambiguous or complex natural language
- **Fallback Strategy:** System continues operating if LLM is unavailable

**Alternatives considered:**
- **Pure LLM parsing:** Rejected due to latency and cost for simple commands
- **Pure rule-based:** Rejected due to inability to handle complex or ambiguous commands
- **NLP libraries (spaCy, NLTK):** Considered but LLM provides better intent extraction

**Trade-offs:**
- Rule-based patterns require maintenance for new command types
- LLM parsing adds latency (200-1000ms) and potential API costs
- Hybrid approach requires managing two parsing paths

---

### Why OpenRouter API + Ollama Fallback?

**What was chosen:** OpenRouter API as primary LLM, with local Ollama as fallback

**Why:**
- **Flexibility:** OpenRouter provides access to multiple models without vendor lock-in
- **Cost Control:** Free tier available, pay-per-use pricing
- **Fallback:** Local Ollama ensures system works offline
- **Model Selection:** Can choose best model for task (speed vs. accuracy)

**Alternatives considered:**
- **OpenAI API directly:** Rejected due to higher costs and vendor lock-in
- **Hugging Face Inference API:** Considered but OpenRouter provides better model selection
- **Pure local LLM:** Evaluated but local models (even small ones) add significant latency

**Trade-offs:**
- OpenRouter requires internet connectivity and API key management
- Local Ollama requires installation and model download
- Model quality varies between providers

---

### Why System Tray + Hotkey UI?

**What was chosen:** Minimal system tray integration with global hotkey support

**Why:**
- **Minimal Footprint:** Doesn't clutter desktop or taskbar
- **Always Accessible:** Available from anywhere via hotkey
- **Low Resource Usage:** Lightweight compared to full GUI applications
- **Windows Native:** Integrates seamlessly with Windows system tray

**Alternatives considered:**
- **Full GUI Application:** Rejected for complexity and resource usage
- **Browser-based UI:** Considered but adds unnecessary dependencies
- **Command-line only:** Evaluated but poor user experience for voice control

**Trade-offs:**
- Less discoverable than prominent GUI
- Limited configuration options in tray menu
- Requires user to remember hotkey combination

---

### Why FastAPI for HTTP Server?

**What was chosen:** FastAPI framework for the optional API server

**Why:**
- **Performance:** High-performance async framework suitable for I/O-bound operations
- **Automatic Documentation:** Built-in OpenAPI/Swagger documentation
- **Type Safety:** Python type hints enable validation and better IDE support
- **Modern Python:** Async/await support for concurrent requests
- **Security Features:** Built-in CORS, dependency injection for authentication

**Alternatives considered:**
- **Flask:** Considered but FastAPI provides better performance and modern features
- **Django:** Rejected as overkill for simple API endpoints
- **Tornado:** Evaluated but FastAPI has better ecosystem and documentation

**Trade-offs:**
- FastAPI requires Python 3.7+ (not an issue for this project)
- Learning curve for async programming concepts

---

### Why CPU-Only Optimization?

**What was chosen:** Optimize all components for CPU-only execution (no GPU required)

**Why:**
- **Accessibility:** Many laptops don't have discrete GPUs
- **Portability:** Works on any Windows machine without special hardware
- **Cost:** No need for expensive GPU hardware
- **Battery Life:** CPU processing is more power-efficient for mobile use

**Alternatives considered:**
- **GPU Acceleration:** Would improve speed but limits compatibility
- **Cloud Processing:** Rejected for privacy and latency reasons

**Trade-offs:**
- Slower transcription (1-3 seconds vs. <1 second with GPU)
- Limited to smaller Whisper models (tiny/base) for acceptable latency
- Higher CPU usage during transcription

## Scalability

### Current Capacity

- **Concurrent Users:** Single-user system (designed for personal use)
- **Request Rate:** API server handles ~5 requests per minute per IP (configurable)
- **Transcription Latency:** 1-3 seconds for typical commands (CPU-only)
- **Model Size:** Supports tiny/base/small Whisper models (larger models possible but slower)

### Scaling Strategy

**Horizontal Scaling:**
- Current architecture is single-process, single-user
- For multi-user scenarios, would require:
  - Process isolation per user
  - Shared token management system
  - Load balancing for API server
  - User-specific configuration storage

**Caching Layer:**
- Whisper model loaded once and reused for all transcriptions
- Custom mappings loaded at startup and cached in memory
- No database required (stateless processing)

**Performance Optimization:**
- Model quantization (int8) reduces memory and improves CPU speed
- Audio chunking for streaming transcription reduces perceived latency
- Rule-based parsing bypasses LLM for common commands (faster response)

**API Rate Limiting:**
- Simple in-memory rate limiting (5 requests/minute per IP)
- For production, would need distributed rate limiting (Redis-based)
- Token-based authentication prevents abuse

**Database Optimization:**
- No database currently (logging to files)
- Future: Could add SQLite for structured logging and analytics
- No data persistence required for core functionality

### Known Limitations

- **Single Process:** Cannot handle multiple simultaneous voice inputs
- **File-based Logging:** Logs grow unbounded (no rotation currently)
- **In-Memory Rate Limiting:** Resets on server restart
- **No Load Balancing:** API server is single-instance

## Security

### Authentication & Authorization

**Bearer Token Authentication:**
- API endpoints require Bearer token in Authorization header
- Tokens generated via API management GUI or token manager
- Tokens validated on each request
- No user accounts or passwords (local-only system)

**Token Management:**
- Tokens stored securely (not in code or config files)
- Token rotation supported via API GUI
- Invalid tokens rejected with 401 Unauthorized

### Data Protection

**Local Processing:**
- All transcription happens locally; audio never leaves the machine
- No cloud services required for core functionality
- Optional LLM parsing can use local Ollama (fully offline)

**File Upload Security:**
- File size limits (10MB maximum)
- Content type validation (audio files only)
- Filename sanitization (prevents path traversal)
- Temporary file cleanup after processing

**Application Whitelist:**
- Execution engine maintains whitelist of allowed applications
- Prevents arbitrary command execution
- Validates application names before launching
- Blocks potentially dangerous system commands

### Network Security

**CORS Restrictions:**
- API server restricts CORS to localhost only
- Prevents cross-origin requests from external sites
- No internet exposure (localhost binding only)

**Rate Limiting:**
- Prevents API abuse and DoS attacks
- 5 requests per minute per IP address
- Returns 429 Too Many Requests when exceeded

**Input Validation:**
- All user input validated before processing
- Command parsing validates intent structure
- File paths sanitized to prevent directory traversal
- SQL injection not applicable (no database)

### Secrets Management

**Environment Variables:**
- API keys stored in environment variables (not in code)
- `.env` file support (should be in `.gitignore`)
- No hardcoded credentials

**Token Storage:**
- Bearer tokens managed securely via token manager
- Not logged or exposed in error messages
- Can be rotated without system restart

### Access Control

**System Permissions:**
- Requires microphone access for audio capture
- Requires system permissions for process execution
- Requires UI automation permissions for keystroke simulation
- All permissions requested at runtime with clear error messages

**Execution Constraints:**
- Application whitelist prevents arbitrary code execution
- Path validation prevents accessing restricted directories
- No elevated privileges required (runs as user)

## Deployment

### Environments

**Development:**
- Local Windows machine
- Python virtual environment (`.venv`)
- Direct execution of Python scripts
- Debug logging enabled

**Production (Current):**
- Single-user local installation
- No separate staging environment
- Users install and run on their own machines
- Configuration via environment variables and config files

### Deployment Process

**Installation Steps:**
1. Clone repository
2. Create Python virtual environment
3. Install dependencies (`pip install -r requirements.txt`)
4. Set environment variables (API keys)
5. Download Whisper models (automatic on first use)
6. Run `start_listener.bat` or `start_api_gui.bat`

**No CI/CD Pipeline:**
- Currently manual deployment
- Users download and install locally
- No automated testing in deployment process
- Future: Could add GitHub Actions for automated releases

### Infrastructure

**Hosting:**
- Self-hosted on user's Windows machine
- No cloud infrastructure required
- No server maintenance needed
- Runs as background process

**Dependencies:**
- Windows 10+ operating system
- Python 3.10+ runtime
- CMake and Visual Studio Build Tools (for whisper.cpp if building from source)
- System audio drivers
- Internet connection (optional, for OpenRouter API)

**Resource Requirements:**
- CPU: Modern multi-core processor recommended
- RAM: 2-4GB for model loading and processing
- Disk: ~500MB for models and dependencies
- No GPU required

### Monitoring & Alerting

**Current Monitoring:**
- JSON Lines logging for all system activity
- Health check endpoint (`/health`) for API server
- Error logging to console and log files
- No external monitoring service

**Future Improvements:**
- Structured error tracking
- Performance metrics collection
- User analytics (opt-in)
- Crash reporting

## Future Improvements

### Known Limitations

**Performance:**
- CPU-only processing limits transcription speed (1-3 seconds)
- Larger Whisper models too slow for real-time use
- No GPU acceleration support currently

**Functionality:**
- Limited to Windows platform (no macOS/Linux support)
- Single-user system (no multi-user support)
- Brittle UI automation (depends on window titles, UI structure)
- Limited IDE integration (primarily Cursor, basic VS Code support)

**Reliability:**
- No automatic error recovery
- Limited retry logic for failed operations
- No health monitoring or automatic restart

### Planned Refactors

**Modular Architecture:**
- Extract transcription, parsing, and execution into separate services
- Enable plugin system for custom command handlers
- Support multiple IDE integrations via plugins

**Performance Optimization:**
- Add GPU acceleration support (optional)
- Implement model caching and preloading
- Optimize audio processing pipeline
- Add request batching for API server

**Cross-Platform Support:**
- Port to macOS and Linux
- Abstract platform-specific code (Windows APIs)
- Support platform-specific audio backends

**Enhanced Reliability:**
- Add automatic error recovery and retry logic
- Implement health checks and automatic restart
- Add comprehensive error handling and user feedback

### Scaling Bottlenecks to Address

**Multi-User Support:**
- Process isolation per user
- User-specific configuration management
- Shared resource management (model loading)

**API Server Scaling:**
- Distributed rate limiting (Redis-based)
- Load balancing for multiple instances
- Connection pooling and async optimization

**Logging & Analytics:**
- Structured logging with rotation
- Database backend for log storage
- Analytics dashboard for usage patterns

**Model Management:**
- Model versioning and updates
- Support for multiple model sizes
- Dynamic model loading/unloading

### Roadmap Integration

See [ROADMAP.md](ROADMAP.md) for detailed feature planning and timeline. Key architectural improvements align with roadmap priorities:

- **Now:** Performance optimizations, error handling improvements
- **Next:** Cross-platform support, plugin architecture
- **Later:** Multi-user support, cloud sync, enterprise features

---

*Initial structure generated by Cursor AI, reviewed and refined manually.*
