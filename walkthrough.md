# 🤖 JARVIS — Just A Rather Very Intelligent System
### Your Complete Beginner's Build Guide

> **Teaching Philosophy**: You will *build* this yourself. I'll guide every step, explain every concept, and celebrate every win. By the end, you'll have an AI anime companion that lives on your desktop, sees your screen, and does tasks for you — safely. 🚀

> **The Rule**: Read the pseudocode carefully, understand it, then type the Python yourself. Do NOT copy-paste. Typing it yourself is how you actually learn!

---

## 🗺️ Project Roadmap (All Phases at a Glance)

> This is a living roadmap. Phases may grow as the project evolves — we never shrink scope, only add to it.

| Phase | Name | What You Build | Status |
|-------|------|----------------|--------|
| 1 | 🏗️ Setup & Workspace | Tools, folders, API keys, Git, Ruff, CodeRabbit | ✅ Done |
| 2 | 🧠 First Python Agent | ChatAgent + Gemini API + settings loader | ✅ Done |
| 3 | ⚡ FastAPI Backend | Python ↔ Electron communication bridge | ✅ Done |
| 4 | 🖥️ Electron + React UI | Real desktop window with Tailwind chat interface | ✅ Done |
| 5 | 🎭 Live2D Anime Avatar | Anime avatar with expressions and animations | 🔄 In Progress |
| 6 | 🔗 LangGraph Agents | Planner + Desktop + Safety agents skeleton | ⏳ Planned |
| 7 | 🧰 Laya Tool Registry | Open-source plugin system for all JARVIS abilities | ⏳ Planned |
| 8 | 🛠️ Tool Decision Layer | LangGraph tool-call routing wired into Laya | ⏳ Planned |
| 9 | 🖱️ Desktop Automation | PyAutoGUI + Playwright + Windows APIs as Laya tools | ⏳ Planned |
| 10 | 👁️ Guide Mode | Screen capture + visual overlays + step-by-step arrows | ⏳ Planned |
| 11 | 🛡️ Safety & Permissions | Plan approval, emergency stop, Laya execution log | ⏳ Planned |
| 12 | 🎤 Voice I/O | Whisper STT (local) + Kokoro.js TTS (local, free) | ⏳ Planned |
| 13 | 🧩 Memory & Storage | SQLite session memory + ChromaDB vector long-term memory | ⏳ Planned |
| 14 | ⚡ Latency Optimization | Under 2s round-trip design for Guide Mode and voice | ⏳ Planned |
| 15 | 📱 Phone Connectivity | Android companion app + Phone Agent + safe pairing | ⏳ Planned |
| 16 | 🦙 Local Model Fallback | Ollama + qwen3:4b for offline/low-latency simple tasks | ⏳ Planned |
| 17 | 🧩 VS Code Integration | WebSocket inside editor for deep dev workflow support | ⏳ Later |

---

## ✅ Phase 1 — Setup Your Workspace (COMPLETE ✅)

### What You Built
- Installed Node.js, Python 3.13, Git, VS Code
- Set up `uv` as your package manager
- Created the full open-source project structure
- Configured `.ruff.toml`, `.gitignore`, `.coderabbit.yaml`
- Got your free Gemini API key
- Set up GitHub Actions CI

---

## ✅ Phase 2 — Make JARVIS Think (First Python Agent + Gemini API)

> **Stop after this phase and tell me "Phase 2 done" when finished!**

---

### 🎯 Goal

Build JARVIS's first working brain:

- A `settings.py` that safely loads your API key from `.env`
- A `ChatAgent` class in `agents/chat/agent.py` that talks to Google Gemini
- An updated `main.py` that runs a real back-and-forth terminal conversation

By the end, you will type a message in your terminal and JARVIS will reply — using real Gemini AI. 🎉

---

### 🤔 Why This Phase Matters

Right now JARVIS is just folders and config files — a body with no soul.

This phase gives JARVIS a brain. Everything we build later — the window, the avatar, the desktop control, the safety system — all of it connects back to this core: an agent that receives input, thinks using an LLM, and sends a response.

Understanding this well now means every future phase will make sense.

---

### 🧠 Four Concepts to Understand First

#### 1. What Is an Agent?

An **agent** is a program that:
1. Receives input (your message)
2. Thinks about it (using Gemini or another LLM)
3. Decides what to do
4. Takes an action or gives a response

In JARVIS, we will have five specialised agents that all work together:

| Agent | Job | When We Build It |
|-------|-----|-----------------|
| Planner | Understands your goal and makes a plan | Phase 6 |
| Desktop | Clicks, types, runs programs | Phase 7 |
| Safety | Checks every action before it runs | Phase 8 |
| Memory | Remembers past conversations | Phase 6 |
| Chat | Has a conversation with you | Phase 2 (NOW!) |

Today we build the Chat agent — the simplest but most important one.

#### 2. What Is a System Prompt?

When you call the Gemini API, you send two things:
- A **system prompt** — instructions that define who JARVIS is (personality, rules, behaviour)
- A **user message** — what you actually said

Think of the system prompt as JARVIS's job description. A well-written system prompt is the difference between generic AI output and JARVIS feeling like a real character.

#### 3. What Is Conversation History?

Real conversations have context. If you say "What about the second option?", JARVIS needs to know what options were discussed before. We store all past messages in a `history` list and send it along with every new message. Gemini reads the whole history and replies in context — exactly like a real conversation.

#### 4. What Is python-dotenv?

Your API key lives in `.env`. The `python-dotenv` library reads that file and makes its values available to Python via `os.getenv()`. This means your key never touches your code — it stays safely in a file that Git ignores.

---

### 🪜 Step-by-Step Instructions

---

#### Step 1 — Set Up Your `.env` File

1. In your JARVIS root folder, find `.env.example`
2. Copy it and rename the copy to `.env`
   (File Explorer: copy → paste → rename)
3. Open `.env` in VS Code
4. Replace the placeholder with your real Gemini API key:

```
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXX
```

**How to verify it worked:**
Open PowerShell in your JARVIS folder and type:
```
type .env
```
You should see your key. If you see an error, the file was not created yet.

> ⚠️ CRITICAL: Run `git status` right now. You should see `.env` listed under
> "Untracked files" — which means Git is ignoring it (from .gitignore). Good!
> If you ever see `.env` under "Changes to be committed", STOP and remove it.

---

#### Step 2 — Install Dependencies with uv

You need three packages. Use `uv add` (not `pip install`) for every package in this project.

| Package | What It Does |
|---------|-------------|
| `google-generativeai` | Official library to talk to Google Gemini |
| `python-dotenv` | Reads your `.env` file and loads the API key |
| `rich` | Makes terminal output beautiful with colours and formatting |

> The command pattern is: `uv add package-name`
> Install all three. Ask me if you need the exact commands!

**How to verify:**
Open `pyproject.toml` — you should see all three listed under `[project] dependencies`.
Also run: `uv run python -c "import google.generativeai; print('OK')"` — it should print `OK`.

---

#### Step 3 — Create the Folder Structure for Phase 2

Create these folders and files. `__init__.py` files are empty — they just tell Python
"this folder is a package you can import from."

```
JARVIS/
├── agents/
│   └── chat/
│       ├── __init__.py        ← Create this (empty)
│       └── agent.py           ← Your ChatAgent class goes here
├── core/
│   ├── __init__.py            ← Create this (empty)
│   └── config/
│       ├── __init__.py        ← Create this (empty)
│       └── settings.py        ← Loads your .env safely
```

> To create an empty file in VS Code: right-click the folder in Explorer → New File → type the name.

---

#### Step 4 — Write `core/config/settings.py`

This is the "front desk" of JARVIS. Every part of the code that needs the API key
or any setting comes here to get it — never hardcodes values themselves.

```
PSEUDOCODE for core/config/settings.py:
(Read carefully, then write Python yourself — do NOT copy!)

--- IMPORTS ---
Import: os
Import: load_dotenv from dotenv
Import: Path from pathlib

--- LOAD THE .env FILE ---
Find the project root:
    ROOT = the parent of the parent of this file (settings.py is 2 levels deep)

Load the .env file from the root:
    load_dotenv(ROOT / ".env")

--- SETTINGS ---
Read values from environment variables using os.getenv():

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY   = os.getenv("GROQ_API_KEY")    ← backup, can be None
JARVIS_MODE    = os.getenv("JARVIS_MODE", "development")
LOG_LEVEL      = os.getenv("LOG_LEVEL", "INFO")

# The Gemini model to use
AI_MODEL = "gemini-1.5-flash"   ← fastest and free-tier friendly

# Safety: crash early if the key is missing instead of failing mysteriously later
If GEMINI_API_KEY is None:
    raise ValueError("GEMINI_API_KEY not found! Did you create your .env file?")
```

**Why this matters:** If someone forgets to set up `.env`, they get a clear error
message immediately — not a confusing crash 10 steps later.

---

#### Step 5 — Write `agents/chat/agent.py`

This is the main event! The `ChatAgent` class that actually talks to Gemini.

```
PSEUDOCODE for agents/chat/agent.py:
(Read carefully, then write Python yourself!)

--- IMPORTS ---
Import: google.generativeai as genai
Import: GEMINI_API_KEY, AI_MODEL from core.config.settings

--- CONFIGURE GEMINI (module level, outside any class) ---
Call: genai.configure(api_key=GEMINI_API_KEY)

--- JARVIS SYSTEM PROMPT ---
Create a variable: JARVIS_SYSTEM_PROMPT
This is a long triple-quoted string that defines JARVIS's personality.

Write it in your own words, but include these ideas:
  "You are JARVIS (Just A Rather Very Intelligent System),
   an intelligent AI desktop companion with an anime-style avatar.
   You are helpful, friendly, and slightly witty — like a knowledgeable
   friend who happens to know everything about computers and technology.
   
   You have three modes:
   - Chat Mode: have a helpful conversation
   - Guide Mode: walk the user through tasks step by step on their real screen
   - JARVIS Mode: take autonomous actions with the user's explicit permission
   
   Right now you are in Chat Mode.
   
   Always be concise, clear, and encouraging. If the user seems confused,
   ask a simple question to help them — don't overwhelm them.
   
   You are aware that you will later be able to see the user's screen,
   control their desktop, and connect to their phone — but only with permission."

--- CLASS: ChatAgent ---

  __init__(self) -> None:
    Create the Gemini model with the system prompt:
        self.model = genai.GenerativeModel(
            model_name=AI_MODEL,
            system_instruction=JARVIS_SYSTEM_PROMPT
        )
    Start a chat session (this holds conversation history automatically):
        self.chat_session = self.model.start_chat(history=[])
    
    Set: self.message_count = 0    ← track how many messages sent
    
    Print: "🤖 JARVIS ChatAgent initialised. Ready to chat!"

  ---

  chat(self, user_message: str) -> str:
    Purpose: Send one message, get one reply. The chat_session handles history.
    
    Steps:
      1. If user_message is empty or only whitespace:
         return "I didn't catch that — could you say it again?"
      
      2. Increment self.message_count
      
      3. Try:
           Send the message to Gemini:
               response = self.chat_session.send_message(user_message)
           
           Extract and return the text:
               return response.text.strip()
         
         Except Exception as error:
           Print: f"⚠️ Gemini error: {error}"
           return "Sorry, I'm having trouble thinking right now. Please try again!"

  ---

  clear_history(self) -> None:
    Purpose: Reset the conversation — start fresh.
    
    Start a brand new chat session:
        self.chat_session = self.model.start_chat(history=[])
    Reset: self.message_count = 0
    Print: "🔄 Conversation history cleared."

  ---

  get_message_count(self) -> int:
    Purpose: How many messages have been sent this session?
    Return: self.message_count
```

---

#### Step 6 — Update `main.py` with a Real Chat Loop

Now wire everything together. Update `main.py` so it runs a REPL —
Read-Evaluate-Print-Loop — the same pattern Python's own interactive shell uses.

```
PSEUDOCODE for updated main.py:
(Read carefully, then write Python yourself!)

--- IMPORTS ---
Import: ChatAgent from agents.chat.agent
Import: Console from rich.console
Import: Panel, Text from rich.panel (for pretty terminal output)

--- SETUP ---
Create a Console object:
    console = Console()

--- MAIN FUNCTION ---
def main() -> None:

  1. Print a welcome banner using rich:
     Something like a Panel with "JARVIS v0.1.0 — Chat Mode" and instructions.
     Include: "Type 'exit' to quit | Type 'clear' to reset conversation"

  2. Create the agent:
     agent = ChatAgent()

  3. Print: "JARVIS is ready. Say something!"

  4. Start the loop:
     While True:
     
       a. Get user input:
          user_input = input("You: ").strip()
       
       b. Handle special commands:
          If user_input is empty:
              continue   ← skip to next loop iteration
          
          If user_input.lower() is "exit" or "quit":
              Print: "JARVIS: Goodbye! Shutting down... 👋"
              break
          
          If user_input.lower() is "clear":
              agent.clear_history()
              Print: "JARVIS: Memory cleared! Fresh start."
              continue
       
       c. Send to JARVIS and print reply:
          reply = agent.chat(user_input)
          Print: f"JARVIS: {reply}"
          
          # Optionally use rich Panel for a nicer look

--- ENTRY POINT ---
if __name__ == "__main__":
    main()
```

---

#### Step 7 — Run and Test JARVIS

```
uv run python main.py
```

Try these test conversations to verify everything works:

**Test 1 — Basic chat:**
```
You: Hello JARVIS, who are you?
JARVIS: (Should introduce itself as JARVIS)
```

**Test 2 — Context memory:**
```
You: My name is Sam.
JARVIS: (Acknowledges)
You: What is my name?
JARVIS: (Should remember "Sam" — this tests conversation history!)
```

**Test 3 — Technical knowledge:**
```
You: Explain what LangGraph is in simple words
JARVIS: (Should give a clear explanation)
```

**Test 4 — Special commands:**
```
You: clear
JARVIS: Memory cleared! Fresh start.
You: What is my name?
JARVIS: (Should say it does not know — memory was cleared! ✅)
```

**Test 5 — Exit:**
```
You: exit
JARVIS: Goodbye! Shutting down...
```

---

#### Step 8 — Run Ruff and Fix Any Issues

Before committing, always run Ruff:

```
uv run ruff check .
uv run ruff format .
```

Ruff will tell you about issues like:
- Lines too long (over 100 characters)
- Missing type hints on function arguments
- Unused imports
- Variables that should be constants (all-caps)

Fix each issue it reports. This is how professional developers work — lint before every commit.

---

#### Step 9 — Commit Your Work

```
git add .
git status        ← double-check .env is NOT listed!
git commit -m "Phase 2: Add ChatAgent with Gemini API and settings loader"
```

If you have GitHub set up, push it and CodeRabbit will review your code! 🐇

---

### 📁 Files Changed in Phase 2

| File | What Changed |
|------|-------------|
| `core/__init__.py` | New — empty module marker |
| `core/config/__init__.py` | New — empty module marker |
| `core/config/settings.py` | New — safely loads .env and exports settings |
| `agents/chat/__init__.py` | New — empty module marker |
| `agents/chat/agent.py` | New — ChatAgent class with Gemini integration |
| `main.py` | Updated — real chat loop with rich terminal output |
| `pyproject.toml` | Updated — three new dependencies added |
| `.env` | New — your real API key (NEVER commit this!) |

---

### ⚠️ Common Mistakes to Watch Out For

| Mistake | Why It's Bad | How to Avoid It |
|---------|-------------|-----------------|
| Putting GEMINI_API_KEY directly in agent.py | Key leaks to GitHub | Always import from settings.py only |
| Committing .env | Your key goes public — you may get charged | Always check `git status` before committing |
| Using `pip install` instead of `uv add` | Breaks the uv-managed environment | Always use `uv add package-name` |
| Forgetting `__init__.py` files | Python cannot import your agents | Every Python package folder needs one |
| Not handling empty input in chat() | Crashes or sends blank messages to Gemini | Check for empty string before calling API |
| Not running Ruff before committing | Bad code style sneaks in undetected | Always: `uv run ruff check .` before `git commit` |

---

### 💡 Gemini API Tips

**Free tier limits for Gemini 1.5 Flash:**
- 15 requests per minute (RPM)
- 1 million tokens per day
- A normal conversation uses ~200–400 tokens per exchange

**If you get a quota error:**
- Wait 60 seconds and try again
- Or set `GROQ_API_KEY` in your `.env` and update settings.py to fall back to Groq

**To check your usage:**
Go to https://aistudio.google.com → your API key → "View usage"

---

### ✅ Phase 2 Success Checklist

You are done when you can check **ALL** of these:

- [ ] 🟢 `uv run python main.py` starts JARVIS in the terminal
- [ ] 🟢 You can type a message and JARVIS replies using Gemini
- [ ] 🟢 JARVIS remembers your name from earlier in the conversation
- [ ] 🟢 Typing "clear" resets the conversation history
- [ ] 🟢 Typing "exit" cleanly stops the program
- [ ] 🟢 `uv run ruff check .` shows zero errors
- [ ] 🟢 `pyproject.toml` shows google-generativeai, python-dotenv, rich
- [ ] 🟢 `git status` shows `.env` is NOT tracked by Git
- [ ] 🟢 You committed your work with a clear commit message

---

### 🎊 Phase 2 Celebration

You just integrated a real large language model into a Python application.
JARVIS now has a brain — it understands context, maintains conversation history,
and can answer almost anything intelligently.

You now have:
- A production-quality settings loader (environment-based config)
- A clean agent class with error handling and retry safety
- A proper REPL interface with special commands
- Ruff-clean code committed to Git

This is not beginner work. This is how professional AI applications are structured. 🏆

---

### 🎉 When You Are Done

Tell me **"Phase 2 done!"** and we will move on to **Phase 3 — FastAPI Backend** ⚡

In Phase 3, you will:
- Wrap your ChatAgent in a FastAPI web server
- Create `/chat` and `/health` endpoints
- Test the API with real HTTP requests
- Set up the Python ↔ Electron communication channel

This is the bridge that connects your Python brain to the Electron window you will build in Phase 4!

---

*Phase 2 complete ✅*

---

## ✅ Phase 3 — FastAPI Backend (Python ↔ Electron Bridge) ⚡

> **Stop after this phase and tell me "Phase 3 done" when finished!**

---

### 🎯 Goal

Wrap your `ChatAgent` in a **FastAPI web server** so the Electron front-end
(which you build in Phase 4) can talk to the Python brain over HTTP and WebSocket.

By the end, you will have a running API server that:
- Responds to `GET /health` — confirms JARVIS is alive
- Responds to `POST /chat` — takes your message, returns JARVIS's reply
- Supports WebSocket on `WS /ws/chat` — for real-time streaming later

You can test every endpoint from your terminal with no front-end needed.

---

### 🤔 Why This Phase Matters

Right now JARVIS only works in your terminal. But the final JARVIS lives in an
Electron desktop window — a JavaScript app. JavaScript cannot directly call Python functions.

The bridge is **FastAPI**: a Python web server that exposes your agents as HTTP
endpoints. Electron sends an HTTP request; FastAPI receives it, runs your Python
agent, and sends back a JSON response.

This is the exact pattern used by real production AI products.

```
React UI (JavaScript)
      |
   HTTP / WebSocket
      |
FastAPI server (Python)   <-- you build this in Phase 3
      |
ChatAgent -> Gemini API
```

---

### 🧠 Three Concepts to Understand First

#### 1. What is FastAPI?

FastAPI is a modern Python framework for building APIs (Application Programming Interfaces).
An API is just a way for two programs to talk to each other using HTTP — the same
protocol your browser uses to load web pages.

Think of FastAPI as a waiter at a restaurant:
- The front-end (React) is the customer placing an order
- The FastAPI endpoint is the waiter taking the order
- Your ChatAgent is the kitchen that makes the food

#### 2. What is an Endpoint?

An endpoint is a URL path that does a specific job:

| Endpoint | Method | What It Does |
|----------|--------|-------------|
| `/health` | GET | Returns "JARVIS is alive" — used to check the server is running |
| `/chat` | POST | Takes a message, returns JARVIS's reply |
| `/ws/chat` | WebSocket | Real-time two-way connection for streaming |

#### 3. What is JSON?

JSON (JavaScript Object Notation) is the data format APIs use to pass information.
Both Python and JavaScript can read it.

When you call `/chat`, you send:
```json
{"message": "Hello JARVIS"}
```
And get back:
```json
{"reply": "Hello! How can I help you today?", "message_count": 1}
```

---

### 🪜 Step-by-Step Instructions

---

#### Step 1 — Install FastAPI and uvicorn

You need two new packages:

| Package | What It Does |
|---------|-------------|
| `fastapi` | The web framework — defines your endpoints |
| `uvicorn` | The ASGI server — actually runs FastAPI and listens for requests |

Install them using `uv add`. You know the pattern by now!

**How to verify:**
```
uv run python -c "import fastapi; print(fastapi.__version__)"
```

---

#### Step 2 — Create the Folder Structure

```
JARVIS/
└── apps/
    └── desktop/
        └── backend/              ← Create this folder
            ├── __init__.py       ← Empty module marker
            ├── server.py         ← Your FastAPI app lives here
            └── models.py         ← Request/response data shapes (Pydantic)
```

---

#### Step 3 — Write `models.py` (Request and Response Shapes)

FastAPI uses Pydantic models to define exactly what data goes in and out of each endpoint.
Think of them as contracts — both sides agree on the shape of the data.

```
PSEUDOCODE for apps/desktop/backend/models.py:
(Read carefully, then write Python yourself!)

--- IMPORTS ---
Import: BaseModel from pydantic

--- MODELS ---

class ChatRequest(BaseModel):
    Purpose: Defines what the /chat endpoint expects to RECEIVE
    
    Fields:
        message: str          <- the user's message (required)
        session_id: str       <- defaults to "default"
                                 (later lets us track multiple users)

class ChatResponse(BaseModel):
    Purpose: Defines what the /chat endpoint sends BACK
    
    Fields:
        reply: str            <- JARVIS's response text
        message_count: int    <- how many messages this session
        status: str           <- "ok" or "error"

class HealthResponse(BaseModel):
    Purpose: What /health sends back
    
    Fields:
        status: str           <- always "ok"
        version: str          <- "0.1.0"
        agent_ready: bool     <- True if ChatAgent initialised OK
```

---

#### Step 4 — Write `server.py` (The FastAPI App)

This is the main file of Phase 3.

```
PSEUDOCODE for apps/desktop/backend/server.py:
(Read carefully, then write Python yourself!)

--- IMPORTS ---
Import: FastAPI, WebSocket, WebSocketDisconnect from fastapi
Import: CORSMiddleware from fastapi.middleware.cors
Import: ChatAgent from agents.chat.agent
Import: ChatRequest, ChatResponse, HealthResponse from .models

--- APP SETUP ---
Create the FastAPI app:
    app = FastAPI(title="JARVIS Backend", version="0.1.0")

Add CORS middleware (this lets Electron/React talk to Python without being blocked):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],        <- allow all origins (fine for local dev)
        allow_methods=["*"],
        allow_headers=["*"],
    )

Create one shared ChatAgent instance (module level):
    agent = ChatAgent()

--- ENDPOINT 1: GET /health ---
Purpose: Confirm JARVIS backend is alive.
Decorated with: @app.get("/health", response_model=HealthResponse)

Steps:
    Return a HealthResponse with:
        status="ok"
        version="0.1.0"
        agent_ready=True

--- ENDPOINT 2: POST /chat ---
Purpose: Receive a message, return JARVIS reply.
Decorated with: @app.post("/chat", response_model=ChatResponse)

Takes: request: ChatRequest

Steps:
    1. Call: reply = agent.chat(request.message)
    
    2. Return a ChatResponse with:
        reply=reply
        message_count=agent.get_message_count()
        status="ok"
    
    3. Wrap in try/except:
       If anything goes wrong, return ChatResponse with:
           reply="Internal error. Please try again."
           message_count=0
           status="error"

--- ENDPOINT 3: DELETE /chat/history ---
Purpose: Clear conversation history (like typing "clear" in the terminal)
Decorated with: @app.delete("/chat/history")

Steps:
    Call: agent.clear_history()
    Return: {"message": "Conversation history cleared."}

--- ENDPOINT 4: GET WS /ws/chat (WebSocket) ---
Purpose: Real-time connection for streaming responses later.
Decorated with: @app.websocket("/ws/chat")

Takes: websocket: WebSocket

Steps:
    1. Accept the connection: await websocket.accept()
    
    2. While True loop:
       Try:
         a. Receive text: data = await websocket.receive_text()
         
         b. Get reply from agent: reply = agent.chat(data)
         
         c. Send reply back: await websocket.send_text(reply)
       
       Except WebSocketDisconnect:
         Break out of the loop (client disconnected -- that is OK)

--- STARTUP AND SHUTDOWN EVENTS ---
@app.on_event("startup"):
    Print: "JARVIS backend starting up..."

@app.on_event("shutdown"):
    Print: "JARVIS backend shutting down..."

--- MAIN BLOCK (for running directly) ---
if __name__ == "__main__":
    Import: uvicorn
    Run: uvicorn.run(app, host="127.0.0.1", port=8000)
```

---

#### Step 5 — Update `main.py` to Support Both Modes

Add a `--server` flag so you can choose between terminal chat (Phase 2) and the API server (Phase 3):

```
PSEUDOCODE for updated main.py:
(Read carefully, then write Python yourself!)

--- IMPORTS ---
Import: sys
Keep existing imports: ChatAgent, Console, Panel, Text

--- UPDATE main() ---
def main() -> None:

  Check if user passed "--server" as a command line argument:
    If "--server" in sys.argv:
        Import uvicorn
        Import app from apps.desktop.backend.server
        Print: "Starting JARVIS backend server on http://127.0.0.1:8000"
        Print: "Docs at: http://127.0.0.1:8000/docs"
        uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
        Return   <- stop here, don't run the terminal loop
  
  Else:
    ... keep your existing terminal chat loop exactly as it is ...
```

---

#### Step 6 — Test the API Server

**Start the server:**
```
uv run python main.py --server
```

You should see:
```
JARVIS backend starting up...
INFO:     Uvicorn running on http://127.0.0.1:8000
```

**Open the auto-generated docs** — this is one of FastAPI's superpowers!
Navigate to: http://127.0.0.1:8000/docs

You will see a beautiful interactive page listing all your endpoints.
You can test each one directly from the browser — no code needed!

**Test manually using curl (in a second terminal):**

Test health:
```
curl http://127.0.0.1:8000/health
```
Expected: `{"status":"ok","version":"0.1.0","agent_ready":true}`

Test chat:
```
curl -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d "{"message": "Hello JARVIS"}"
```
Expected: `{"reply":"...JARVIS response...","message_count":1,"status":"ok"}`

Clear history:
```
curl -X DELETE http://127.0.0.1:8000/chat/history
```

**Stop the server:** Press `Ctrl+C`

---

#### Step 7 — Run Ruff and Commit

```
uv run ruff check .
uv run ruff format .
git add .
git status        <- make sure .env is NOT listed!
git commit -m "Phase 3: FastAPI backend with chat, health, and WebSocket endpoints"
```

---

### 📁 Files Changed in Phase 3

| File | What Changed |
|------|-------------|
| `apps/desktop/backend/__init__.py` | New — empty module marker |
| `apps/desktop/backend/models.py` | New — Pydantic request/response shapes |
| `apps/desktop/backend/server.py` | New — FastAPI app with all endpoints |
| `main.py` | Updated — added --server flag to run the API |
| `pyproject.toml` | Updated — fastapi and uvicorn added as dependencies |

---

### ⚠️ Common Mistakes to Watch Out For

| Mistake | Why It's Bad | How to Avoid It |
|---------|-------------|-----------------|
| Using `pip install fastapi` instead of `uv add fastapi` | Breaks your uv environment | Always use `uv add` |
| Forgetting the CORS middleware | Electron blocks the request with a CORS error | Always add CORSMiddleware for local dev |
| Creating a new ChatAgent on every request | Each request starts a fresh conversation with no memory | Create ONE agent at module level, reuse it |
| Not wrapping agent.chat() in try/except | One Gemini error crashes the whole server | Always handle exceptions in endpoints |
| Using `app.run()` instead of uvicorn | FastAPI does not have a built-in `.run()` | Always use uvicorn to run FastAPI |

---

### ✅ Phase 3 Success Checklist

You are done when you can check **ALL** of these:

- [ ] 🟢 `uv run python main.py --server` starts the server on port 8000
- [ ] 🟢 `http://127.0.0.1:8000/docs` shows the FastAPI interactive docs
- [ ] 🟢 `GET /health` returns `{"status": "ok", "agent_ready": true}`
- [ ] 🟢 `POST /chat` with `{"message": "Hello"}` returns a JARVIS reply
- [ ] 🟢 `DELETE /chat/history` clears the conversation
- [ ] 🟢 WebSocket endpoint `/ws/chat` accepts a connection (test from the docs page)
- [ ] 🟢 `uv run python main.py` (without --server) still works as terminal chat
- [ ] 🟢 `uv run ruff check .` shows zero errors
- [ ] 🟢 You committed your work with a clear commit message

---

### 🎊 Phase 3 Celebration

You now have a real working API! JARVIS's brain is no longer locked in a terminal —
it is accessible over HTTP, which means any program (Electron, a browser, a mobile app)
can talk to it.

You have:
- A proper FastAPI server with 4 endpoints
- Pydantic models for data validation
- CORS configured for Electron compatibility
- WebSocket support ready for real-time streaming
- Auto-generated interactive API documentation

This is professional backend engineering. 🏆

---

### 🎉 When You Are Done

Tell me **"Phase 3 done!"** and we will move on to **Phase 4 — Electron Window + React UI** 🖥️

In Phase 4, you will:
- Create an Electron app that opens a desktop window for JARVIS
- Build a React chat interface (input box, message bubbles, JARVIS name/status)
- Connect the React UI to your Phase 3 FastAPI server
- JARVIS will exist as a real desktop application for the first time!

---

*Phase 3 complete — last updated: Phase 3*

---

## ✅ Phase 3 — FastAPI Backend Complete ✅

Phase 3 bugs fixed in this session:
- `/health` endpoint was accidentally calling agent.chat() instead of returning status
- `/chat` endpoint was missing entirely
- WebSocket handler `websocket` was a bare annotation, not a real parameter
- `--server` flag was inside the chat loop instead of at the start of `main()`
- `google.generativeai` deprecated — migrated to new `google.genai` SDK
- Switched to `gemini-2.0-flash` model

---

## 🔨 Phase 4 — Electron + React Desktop Window 🖥️

> **Stop after this phase and tell me "Phase 4 done" when finished!**

---

### 🎯 Goal

Give JARVIS a real desktop window. By the end of this phase you will have:

- An Electron desktop app that opens when you run `npm start`
- A React chat interface — input box, message bubbles, JARVIS name and status
- The front-end connected live to your Phase 3 FastAPI server
- JARVIS existing as a real desktop application for the first time 🎉

---

### ⚠️ FIX YOUR API KEY FIRST — Do This Before Anything Else

Your `.env` file still has a placeholder key. **JARVIS will not work until you do this.**

1. Go to **https://aistudio.google.com**
2. Click **"Get API Key"** → **"Create API key"**
3. Copy the key (it starts with `AIza...`)
4. Open `.env` in VS Code
5. Replace `your_gemini_api_key_here` with your real key:
   ```
   GEMINI_API_KEY=AIzaSy.....your_real_key_here
   ```
6. Save. Then verify:
   ```
   uv run python main.py
   ```
   Type "hello" — if JARVIS replies, your key is working!

---

### 🤔 Why This Phase Matters

Right now JARVIS only exists in a black terminal window. The whole point of JARVIS
is that it lives *on* your desktop — it can see your screen, guide you, and display
an anime avatar. None of that is possible in a terminal.

**Electron** lets you build a desktop app using web technologies (HTML + CSS + JS).
The window is just a browser, packaged as a proper app with system access.

**React** is the most popular UI library in the world — VS Code, Slack, Discord,
and Figma all use Electron + React under the hood.

---

### 🧠 Four Concepts to Understand First

#### 1. What is Electron?

Electron has two parts that run separately:

- **Main process** — Node.js code that creates the window (`BrowserWindow`).
  Has access to your file system, system tray, OS notifications.
- **Renderer process** — The web page (React) the user sees.
  Like a browser tab embedded inside the window.

They communicate through a secure bridge called **IPC** (Inter-Process Communication).

#### 2. What is React?

React is a JavaScript library for building UIs from small reusable pieces called **components**.
You describe *what* the UI should look like based on data (**state**), and React
updates the screen efficiently whenever data changes.

#### 3. What is Vite?

Vite is a modern build tool that runs your React app with instant hot-reloading.
Changes you make appear in the app within milliseconds — no full rebuild needed.
In development, Electron loads your React app from Vite's dev server.

#### 4. How Does Front-end Talk to Back-end?

```
React UI  →  fetch("http://127.0.0.1:8000/chat", {...})  →  FastAPI  →  ChatAgent  →  Gemini
```

React sends HTTP requests to your Phase 3 server. The server calls your Python agent
and sends the response back as JSON. React displays it as a chat bubble.

---

### 🪜 Step-by-Step Instructions

---

#### Step 1 — Check Node.js Is Installed

Open a new terminal and run:
```
node --version
npm --version
```

You need Node.js v18 or higher and npm v9 or higher.
If not installed: go to https://nodejs.org and download the LTS version.

---

#### Step 2 — Create the React Project with Vite

Navigate into your desktop folder and initialise:
```
cd apps/desktop
npm create vite@latest . -- --template react
```

The `.` means "create in this folder, not a new subfolder."
Say yes to overwriting existing files if asked.

Then install packages:
```
npm install
```

Then add Electron:
```
npm install --save-dev electron electron-builder concurrently wait-on cross-env
```

---

#### Step 3 — Create `electron/main.js` (The Desktop Window Creator)

Create a folder `apps/desktop/electron/` and inside it create `main.js`.

```
PSEUDOCODE for apps/desktop/electron/main.js:
(This is JavaScript — read carefully, then type it yourself!)

--- IMPORTS ---
const { app, BrowserWindow, shell } = require("electron")
const path = require("path")

const isDev = process.env.NODE_ENV === "development"

--- CREATE WINDOW ---
function createWindow():
    win = new BrowserWindow({
        width: 420,
        height: 720,
        frame: false,              <- no default title bar
        transparent: true,         <- transparent bg (for avatar later)
        alwaysOnTop: false,
        resizable: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    })
    
    If isDev:
        win.loadURL("http://localhost:5173")   <- Vite dev server
        win.webContents.openDevTools({ mode: "detach" })
    Else:
        win.loadFile(path.join(__dirname, "../dist/index.html"))

--- APP LIFECYCLE ---
app.whenReady().then(createWindow)

app.on("window-all-closed", () -> {
    if (process.platform !== "darwin") app.quit()
})

app.on("activate", () -> {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
```

---

#### Step 4 — Update `package.json`

Open `apps/desktop/package.json` and make these changes:

```
PSEUDOCODE — changes to package.json:
(Be careful with JSON — every key needs quotes, trailing commas cause errors!)

1. Add at the top level (same level as "name" and "version"):
   "main": "electron/main.js"

2. In "scripts", add these entries:
   "electron": "electron ."
   "electron:dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && cross-env NODE_ENV=development electron .\""
   "start": "npm run electron:dev"
   "build": "vite build && electron-builder"
```

---

#### Step 5 — Update `vite.config.js`

Electron needs Vite to serve on a specific port and base path.
Open `apps/desktop/vite.config.js` and update it:

```
PSEUDOCODE for vite.config.js:
(This is JavaScript — use the Vite defineConfig pattern)

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,        <- must match the URL in electron/main.js
        strictPort: true   <- fail if port is taken (so we know immediately)
    },
    base: "./"             <- important for Electron production builds
})
```

---

#### Step 6 — Rewrite `src/App.jsx` (The Chat UI)

Delete everything Vite generated in App.jsx and write a real JARVIS chat interface.

```
PSEUDOCODE for apps/desktop/src/App.jsx:
(JavaScript/JSX — read carefully, then type it yourself!)

--- IMPORTS ---
Import useState, useEffect, useRef from "react"

--- CONSTANT ---
const API_URL = "http://127.0.0.1:8000"

--- COMPONENT: App ---
function App():

  --- STATE ---
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef(null)

  --- EFFECT: Check backend health on load ---
  useEffect (runs once, [] dependency):
    async function checkHealth():
      Try:
        response = await fetch(API_URL + "/health")
        If response.ok: setIsConnected(true)
        Else: setIsConnected(false)
      Catch: setIsConnected(false)
    
    checkHealth()
    
    Add welcome message:
    setMessages([{
        id: 1,
        role: "jarvis",
        text: "Hello! I am JARVIS. How can I help you today?"
    }])

  --- EFFECT: Auto-scroll to bottom when messages update ---
  useEffect (runs whenever messages changes):
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  --- FUNCTION: sendMessage ---
  async function sendMessage():
    If input.trim() is empty OR isLoading: return
    
    const userText = input.trim()
    
    Add user message to state:
    setMessages(prev => [...prev, { id: Date.now(), role: "user", text: userText }])
    
    setInput("")
    setIsLoading(true)
    
    Try:
      response = await fetch(API_URL + "/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userText })
      })
      data = await response.json()
      setMessages(prev => [...prev, { id: Date.now() + 1, role: "jarvis", text: data.reply }])
    Catch error:
      setMessages(prev => [...prev, {
          id: Date.now() + 1,
          role: "jarvis",
          text: "I lost connection to my brain. Is the Python server running?"
      }])
    Finally:
      setIsLoading(false)

  --- FUNCTION: handleKeyDown ---
  function handleKeyDown(e):
    If e.key === "Enter" AND NOT e.shiftKey:
        e.preventDefault()
        sendMessage()

  --- JSX RETURN ---
  return (
    <div className="app">
      
      <header className="header">
        <div className="title">
          <span className="title-icon">🤖</span>
          <span>JARVIS</span>
        </div>
        <div className="status">
          <div className={isConnected ? "status-dot connected" : "status-dot offline"} />
          <span>{isConnected ? "Connected" : "Offline"}</span>
        </div>
      </header>
      
      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={"message " + msg.role}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message jarvis loading">
            <span>.</span><span>.</span><span>.</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="input-area">
        <textarea
          value={input}
          onChange={e -> setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Talk to JARVIS..."
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="send-btn"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
      
    </div>
  )
```

---

#### Step 7 — Write `src/App.css` (Dark Modern Styling)

Delete all Vite's default CSS and write this:

```
PSEUDOCODE for App.css — the rules you need:
(Translate to actual CSS!)

* (all elements):
    box-sizing: border-box
    margin: 0, padding: 0

body, html, #root:
    height: 100%
    overflow: hidden
    font-family: "Inter", "Segoe UI", system-ui, sans-serif

.app:
    height: 100vh
    display: flex, flex-direction: column
    background: rgba(13, 13, 23, 0.96)    <- very dark navy, slightly transparent
    border: 1px solid rgba(100, 80, 255, 0.3)    <- subtle purple border
    border-radius: 12px
    color: #e8e8f0
    overflow: hidden

.header:
    padding: 14px 18px
    background: rgba(20, 20, 35, 0.9)
    border-bottom: 1px solid rgba(100, 80, 255, 0.2)
    display: flex, justify-content: space-between, align-items: center

.title:
    display: flex, align-items: center, gap: 8px
    font-size: 16px, font-weight: 600
    letter-spacing: 1px

.title-icon:
    font-size: 20px

.status:
    display: flex, align-items: center, gap: 6px
    font-size: 11px, color: #888

.status-dot:
    width: 8px, height: 8px, border-radius: 50%

.status-dot.connected:
    background: #4ade80     <- green
    box-shadow: 0 0 6px #4ade80

.status-dot.offline:
    background: #f87171     <- red

.messages:
    flex: 1
    overflow-y: auto
    padding: 16px
    display: flex, flex-direction: column, gap: 10px

-- scrollbar styling (optional, makes it look clean) --
.messages::-webkit-scrollbar: width 4px
.messages::-webkit-scrollbar-track: transparent
.messages::-webkit-scrollbar-thumb: background rgba(100, 80, 255, 0.4), border-radius 2px

.message:
    max-width: 78%
    padding: 10px 14px
    border-radius: 14px
    font-size: 14px, line-height: 1.5
    word-break: break-word
    animation: fadeIn 0.2s ease

.message.user:
    align-self: flex-end
    background: linear-gradient(135deg, #6b4fff, #9b59ff)   <- purple gradient
    color: white
    border-bottom-right-radius: 4px

.message.jarvis:
    align-self: flex-start
    background: rgba(40, 40, 60, 0.9)
    color: #e0e0f0
    border-bottom-left-radius: 4px
    border: 1px solid rgba(100, 80, 255, 0.15)

.message.loading span:
    animation: blink 1.2s infinite
    Each span: animation-delay 0s, 0.2s, 0.4s respectively

@keyframes blink:
    0%, 80%, 100%: opacity 0
    40%: opacity 1

@keyframes fadeIn:
    from: opacity 0, transform translateY(4px)
    to: opacity 1, transform translateY(0)

.input-area:
    padding: 12px 16px
    border-top: 1px solid rgba(100, 80, 255, 0.2)
    display: flex, gap: 8px, align-items: flex-end
    background: rgba(15, 15, 25, 0.9)

.input-area textarea:
    flex: 1
    background: rgba(30, 30, 50, 0.8)
    border: 1px solid rgba(100, 80, 255, 0.25)
    border-radius: 10px
    color: #e0e0f0
    padding: 10px 14px
    font-size: 14px, font-family: inherit
    resize: none
    min-height: 44px, max-height: 120px
    outline: none
    When focus: border-color rgba(100, 80, 255, 0.6)

.send-btn:
    background: linear-gradient(135deg, #6b4fff, #9b59ff)
    color: white
    border: none
    border-radius: 10px
    padding: 10px 20px
    font-size: 14px, font-weight: 600
    cursor: pointer
    min-width: 64px
    transition: all 0.2s
    When disabled: opacity 0.4, cursor not-allowed
    When hover (not disabled): filter brightness(1.15), transform translateY(-1px)
```

---

#### Step 8 — Run It!

You need two terminals at the same time:

**Terminal 1** (JARVIS root folder):
```
uv run python main.py --server
```

**Terminal 2** (apps/desktop folder):
```
npm start
```

A dark, styled desktop window opens! Type a message to JARVIS. 🎉

---

### 📁 Files Changed in Phase 4

| File | What Changed |
|------|-------------|
| `apps/desktop/electron/main.js` | New — Electron main process |
| `apps/desktop/src/App.jsx` | Rewritten — React chat UI |
| `apps/desktop/src/App.css` | Rewritten — dark modern styling |
| `apps/desktop/package.json` | Updated — added Electron scripts |
| `apps/desktop/vite.config.js` | Updated — port and base path |

---

### ⚠️ Common Mistakes to Watch Out For

| Mistake | Why It's Bad | How to Avoid |
|---------|-------------|--------------|
| Not starting Python server first | All chat calls fail | Always start `uv run python main.py --server` first |
| Wrong API_URL in App.jsx | fetch() fails | Use `http://127.0.0.1:8000` exactly |
| Trailing comma in package.json | JSON parse error, app won't start | Validate JSON — every item except the last has no comma |
| Using `window.require()` in React | Crashes — renderer has no Node access | Only use fetch() in React, never Node APIs |
| API key still a placeholder | JARVIS replies "having trouble thinking" | Fix .env with real AIza... key from aistudio.google.com |

---

### ✅ Phase 4 Success Checklist

- [ ] 🟢 Real Gemini API key in `.env` (JARVIS replies in terminal mode)
- [ ] 🟢 `npm start` (in apps/desktop) opens a real desktop window
- [ ] 🟢 Window shows "Connected" (green dot) when Python server is running
- [ ] 🟢 Typing a message shows JARVIS reply in a styled bubble
- [ ] 🟢 User messages appear on the right (purple), JARVIS on the left (dark)
- [ ] 🟢 Window shows "Offline" (red dot) when Python server is stopped
- [ ] 🟢 Git commit done

---

### 🎊 Phase 4 Celebration

JARVIS is now a real desktop application! 🖥️

You have built a complete full-stack AI application:
- Python AI backend (Phases 2 + 3)
- React front-end with a dark, modern UI (Phase 4)
- Connected via HTTP — the same pattern used by every production AI product

From here, every phase adds new superpowers on top of this foundation! 🏆

---

### 🎉 When You Are Done

Tell me **"Phase 4 done!"** and we will move on to **Phase 5 — Live2D Anime Avatar** 🎭

In Phase 5 you will:
- Load a Live2D anime model inside the Electron window
- Wire JARVIS expressions to the chat (thinking, speaking, happy, concerned)
- JARVIS will feel genuinely alive for the first time!

---

*Phase 4 — last updated: Phase 4*

---

## ✅ Phase 4 — Electron + React Desktop Window Complete ✅

**What was fixed in this session:**
- Critical crash: `"main": "main.js"` → fixed to `"electron/main.cjs"`
- CJS vs ESM conflict: renamed `main.js` → `main.cjs` (Electron needs CommonJS)
- `setMessages()` at component root (infinite re-render) → moved into `useEffect`
- `useEffect(async...)` anti-pattern → fixed with inner async function
- `response`/`data` undeclared global variables → added `const`
- Missing `export default` on App component
- Migrated from plain CSS to **Tailwind v4** via `@tailwindcss/vite`
- `gemini-2.0-flash` deprecated → switched to `gemini-2.5-flash`
- CI/CD: `--all-extras` → `--all-groups`, `tool.uv.dev-dependencies` → `[dependency-groups]`
- Removed deprecated `google-generativeai` (saved 15 packages)

---

## 🎭 Phase 5 — Live2D Anime Avatar

> **Stop after this phase and tell me "Phase 5 done" when finished!**

---

### 🎯 Goal

Give JARVIS a face. By the end of this phase you will have:

- A Live2D anime avatar displayed inside the Electron window
- Smooth idle breathing/blinking animation running at all times
- Four expressions that JARVIS automatically switches between:
  - 😐 **Idle** — when waiting for you to type
  - 🤔 **Thinking** — while loading a reply (the dots are showing)
  - 💬 **Speaking** — right after a reply appears
  - 😊 **Happy** — after positive keywords in the reply
- The avatar sitting **above** the chat interface (or side by side)

---

### 🤔 Why This Phase Matters

JARVIS is meant to feel like a companion, not just a chat box. An animated anime avatar:

- Makes JARVIS feel **alive and present** on your desktop
- Gives visual feedback ("JARVIS is thinking...") without reading text
- Is the foundation for Phase 12 (voice) — lip sync comes later
- Differentiates JARVIS from a plain chatbot — this is the "desktop companion" part

Live2D is used in games like *Genshin Impact*, *Blue Archive*, and anime apps like
*VTuber* setups. You are adding the same technology to your desktop app.

---

### 🧠 Three Concepts to Understand First

#### 1. What is Live2D?

Live2D is a rendering technology for 2D anime characters. Instead of playing a
video loop, a Live2D model is a **rigged drawing** — individual parts (eyes, mouth,
head, hair) can move independently based on math.

The model file (`.moc3`) contains:
- All the art pieces (textures)
- Rigging data (how to deform each piece)
- Motion files (`.motion3.json`) — pre-made animations for idle, talking, etc.
- Expression files — parameter values for different moods

#### 2. What is `pixi-live2d-display`?

Pixi.js is a 2D WebGL rendering engine (the same one used in many browser games).
`pixi-live2d-display` is a plugin that loads Live2D models into Pixi.js.

It handles all the complex math — you just say:
```javascript
const model = await Live2DModel.from("path/to/model.model3.json")
app.stage.addChild(model)
model.expression("happy")
```

And the avatar appears and animates.

#### 3. What is a Free Live2D Model?

Live2D provides free sample models for learning/development. The most popular
for projects like this is **"hiyori"**, **"Mao"**, or **"koharu"** — all are
freely downloadable from the official Live2D sample page.

You can also use models from VTuber model packs shared under creative licenses.

---

### 🪜 Step-by-Step Instructions

---

#### Step 1 — Get a Free Live2D Model

Download a free sample model:

1. Go to: **https://www.live2d.com/en/cubism/download/sample-data/**
2. Download any free model (recommended: **"Mao"** or **"hiyori"** — both are anime style)
3. Extract the zip
4. Copy the entire model folder into your project:

```
apps/desktop/public/live2d/
└── Mao/                           ← or whatever model you downloaded
    ├── Mao.model3.json            ← the main file you will reference
    ├── Mao.moc3
    ├── Mao.physics3.json
    ├── textures/
    │   └── texture_00.png
    └── motions/
        ├── idle_01.motion3.json
        └── ...
```

**Why `public/`?** Vite serves everything in `public/` as static files — Electron
can access them with a simple URL.

---

#### Step 2 — Install Pixi.js and Live2D Plugin

```
cd apps/desktop
npm install pixi.js@7 pixi-live2d-display
```

**Important:** Use **Pixi.js v7** — `pixi-live2d-display` is not yet compatible
with v8. The version matters!

Verify:
```
node -e "const p = require('./node_modules/pixi.js/package.json'); console.log(p.version)"
```

---

#### Step 3 — Create the Avatar Component

Create a new file: `apps/desktop/src/Avatar.jsx`

```
PSEUDOCODE for apps/desktop/src/Avatar.jsx:
(Read carefully, then write JSX yourself!)

--- IMPORTS ---
Import: useEffect, useRef from "react"
Import: Application from "pixi.js"
Import: Live2DModel from "pixi-live2d-display"

--- CONSTANTS ---
MODEL_PATH = "/live2d/Mao/Mao.model3.json"
  (Update this to match your actual model folder and filename)

EXPRESSIONS = {
    idle:     null,          <- null means default/reset expression
    thinking: "thinking",   <- expression name defined in the .model3.json
    speaking: "speaking",
    happy:    "happy",
}

--- COMPONENT: Avatar ---
function Avatar({ expression = "idle" }):
  Purpose: Takes an expression prop ("idle", "thinking", "speaking", "happy")
           and displays the Live2D model with that expression applied.

  canvasRef = useRef(null)    <- reference to the <canvas> element
  modelRef  = useRef(null)    <- reference to the loaded Live2DModel
  appRef    = useRef(null)    <- reference to the Pixi Application

  --- EFFECT 1: Load the model (runs once on mount) ---
  useEffect (() => {
    async function loadModel():

        1. Create a Pixi Application:
           app = new Application({
               view: canvasRef.current,   <- attach to our <canvas>
               width: 300,
               height: 400,
               transparent: true,         <- no white background
               antialias: true,
           })
           appRef.current = app

        2. Load the Live2D model:
           model = await Live2DModel.from(MODEL_PATH)
           modelRef.current = model

        3. Add model to Pixi stage:
           app.stage.addChild(model)

        4. Position and scale the model:
           model.x = app.screen.width / 2   <- center horizontally
           model.y = app.screen.height       <- anchor at bottom
           model.anchor.set(0.5, 1.0)       <- center-bottom anchor point
           model.scale.set(0.25)            <- adjust until model fits nicely
                                                (try values between 0.1 and 0.5)

        5. Start idle motion:
           model.motion("idle")             <- plays the idle animation loop

    loadModel()

    Cleanup (returned function):
        If appRef.current exists: appRef.current.destroy()

  }, [])   <- empty array = run once

  --- EFFECT 2: Apply expression when prop changes ---
  useEffect (() => {
    If modelRef.current is null: return

    const expressionName = EXPRESSIONS[expression]

    If expressionName is null:
        model.expression()     <- reset to default
    Else:
        model.expression(expressionName)

  }, [expression])   <- runs whenever the expression prop changes

  --- RENDER ---
  Return:
    <div className="w-full flex justify-center">
      <canvas ref={canvasRef} style={{ background: "transparent" }} />
    </div>

export default Avatar
```

---

#### Step 4 — Wire Avatar Expressions to Chat State in App.jsx

Now connect the avatar's mood to what is happening in the chat.

```
PSEUDOCODE — changes to src/App.jsx:
(Add these on top of your existing App.jsx)

--- NEW IMPORT at top ---
Import Avatar from "./Avatar"

--- NEW STATE ---
const [avatarExpression, setAvatarExpression] = useState("idle")

--- CHANGES TO sendMessage() ---
When user sends a message:
    BEFORE fetching: setAvatarExpression("thinking")
    
    AFTER getting reply:
        If reply text includes any of ["great", "happy", "done", "sure", "love"]:
            setAvatarExpression("happy")
        Else:
            setAvatarExpression("speaking")
    
    After 3 seconds: setAvatarExpression("idle")   <- use setTimeout

--- RENDER CHANGES ---
ABOVE the messages div, add:
    <Avatar expression={avatarExpression} />

Your layout should now look like:
    <div className="app">              <- whole window
        <header ... />                 <- JARVIS title + status dot
        <Avatar expression={...} />   <- NEW: avatar panel
        <div messages ... />           <- chat history  
        <div input-area ... />         <- input box + send button
    </div>
```

---

#### Step 5 — Adjust the Window Height

The avatar takes vertical space. Update `electron/main.cjs` to make the window taller:

```
PSEUDOCODE — change in electron/main.cjs:
(Small change — update the height value)

In createWindow():
    Change: height: 720
    To:     height: 900      <- taller window to fit avatar + chat
```

---

#### Step 6 — Handle Missing Expressions Gracefully

Live2D models have different expression names. Your model might not have "thinking",
"speaking", or "happy" by default. Here is how to find out what expressions it has:

Open the `.model3.json` file in VS Code and look for the `"Expressions"` array:
```json
"Expressions": [
    { "Name": "angry", "File": "expressions/angry.exp3.json" },
    { "Name": "happy", "File": "expressions/happy.exp3.json" }
]
```

Update your `EXPRESSIONS` constant in `Avatar.jsx` to match the actual names
in your model file. If "thinking" does not exist, use "angry" or any available one.

---

#### Step 7 — Test It

1. Start the Python server (if not running):
   ```
   uv run python main.py --server
   ```

2. Start the Electron app:
   ```
   cd apps/desktop
   npm start
   ```

3. You should see:
   - The anime avatar displayed above the chat
   - The avatar's idle animation playing (breathing, blinking)
   - When you send a message: avatar switches to "thinking"
   - When JARVIS replies: avatar switches to "speaking" then "idle"

---

#### Step 8 — Commit

```
cd C:\Users\HP\Documents\JARVIS
git add .
git commit -m "Phase 5: Live2D anime avatar with expression system"
```

---

### 📁 Files Changed in Phase 5

| File | What Changed |
|------|-------------|
| `apps/desktop/public/live2d/` | New — your Live2D model files |
| `apps/desktop/src/Avatar.jsx` | New — the avatar component |
| `apps/desktop/src/App.jsx` | Updated — avatar wired to chat state |
| `apps/desktop/electron/main.cjs` | Updated — window height increased |
| `apps/desktop/package.json` | Updated — pixi.js and pixi-live2d-display added |

---

### ⚠️ Common Mistakes to Watch Out For

| Mistake | Why It's Bad | How to Avoid |
|---------|-------------|--------------|
| Using `pixi.js` v8 | `pixi-live2d-display` doesn't support v8 yet | Install `pixi.js@7` specifically |
| Wrong model path | "Failed to load model" error | Double-check the `.model3.json` filename and path |
| Expression name doesn't match model | No visible change | Open `.model3.json`, find exact expression names |
| Model appears but has white background | `transparent: false` in Pixi app | Set `transparent: true` in the Pixi Application config |
| Model is invisible or tiny | Wrong scale value | Try `model.scale.set(0.3)` and adjust up/down |
| Avatar cuts off at bottom | Window too short | Increase height in `electron/main.cjs` |

---

### ✅ Phase 5 Success Checklist

- [ ] 🟢 `npm start` shows the avatar above the chat interface
- [ ] 🟢 Idle animation is playing (model breathes/blinks smoothly)
- [ ] 🟢 Sending a message makes the avatar switch to "thinking"
- [ ] 🟢 After JARVIS replies, avatar switches to "speaking" then back to "idle"
- [ ] 🟢 Background is transparent (no white box around avatar)
- [ ] 🟢 Git commit done

---

### 🎊 Phase 5 Celebration

JARVIS now looks and feels like a real AI companion! 🎭

Your JARVIS has:
- A real desktop window (Phase 4) ✅
- A Live2D anime avatar with mood expressions (Phase 5) ✅
- A Python AI brain with FastAPI (Phases 2 + 3) ✅
- Everything connected end to end ✅

This is what most developers consider the hardest visual milestone of a desktop AI —
you have done it! Everything from here is adding *capabilities* to an already beautiful app.

---

### 🎉 When You Are Done

Tell me **"Phase 5 done!"** and we will move on to **Phase 6 — LangGraph Agents** 🔗

In Phase 6 you will:
- Replace the single ChatAgent with a LangGraph multi-agent system
- Build a Planner agent (decides what to do), Desktop agent (does it), and Safety agent (approves it)
- Wire them into a directed graph so JARVIS can do complex multi-step tasks

---

*Phase 5 — last updated: Phase 5*

---

## ✅ Phase 5 — Live2D Anime Avatar Complete ✅

**What was fixed:**
- `require()` mixed with `import` → pure ESM `import * as PIXI from "pixi.js"`
- `import Application from "pixi.js"` (no default export) → `import * as PIXI`
- Nested `useEffect` hooks → both at component root level
- `transparent` typo → `backgroundAlpha: 0`  (Pixi v7 API)
- `MODEL_PATH` / `EXPRESSIONS` undeclared → added `const`
- `model.expression()` → `model.motion()` (hiyori has NO Expressions, only Motions)
- Missing `Live2DModel.registerTicker(PIXI.Ticker)` → added (required for animation)
- Pixi vite ESM crash → fixed with `optimizeDeps.include` in vite.config.js
- CI ruff error → added `ruff>=0.9` to `[dependency-groups]` in pyproject.toml

**Hiyori model motion groups (from hiyori_free_t08.model3.json):**

| Chat State | Motion Group | Description |
|---|---|---|
| idle | `Idle` | Calm breathing loop (3 variants) |
| thinking | `FlickDown` | Looking down thoughtfully |
| speaking | `Tap` | Cheerful response |
| happy | `Flick` | Excited reaction |

---

## 🖼️ Bonus — How to Make JARVIS Use YOUR Face (Custom Avatar)

> This is a separate optional guide. You do not need to do this now.
> Come back to it whenever you want to replace hiyori with yourself!

---

### 🎯 Goal

Replace the hiyori anime model with a custom avatar made from your own photos —
turning JARVIS into a personalised AI companion that literally looks like you
(or any character you design).

---

### 🤔 Three Approaches — Pick One

#### Option A: VTuber-Style (Recommended for Beginners) 🟢

**What you need:** 1 clear front-facing photo of yourself

**How it works:**
1. Upload your photo to **ReadyPlayerMe** (https://readyplayer.me)
2. Their AI creates a 3D avatar from your photo in 2 minutes
3. Download as `.glb` (3D) or use their SDK
4. Render it in Electron using **Three.js** (WebGL 3D renderer)

**Why it's good:** Completely free, no art skills needed, auto-generated from your photo

**Why it's limited:** 3D avatar, not 2D anime style. Less "JARVIS" feeling.

---

#### Option B: AI-Generated Live2D Model 🟡

**What you need:** A few reference photos of yourself or a character you want

**How it works:**
1. Use **VRoid Studio** (https://vroid.com/en/studio) — free desktop app
   - Create a stylised anime character by adjusting sliders
   - Export as `.vrm` format
2. Use **live2d-converter** tools to approximate a Live2D rig from the VRM
   OR
   Use a **VRoid → Live2D** pipeline (requires Cubism Editor Pro — $160/year)

**Why it's good:** True anime style, your design, free base tools
**Why it's limited:** Full Live2D rigging from scratch needs Cubism Pro

---

#### Option C: AI Portrait → Animated PNG (Simplest) 🟢

**What you need:** A selfie

**How it works:**
1. Use **Lensa AI** or **Stable Diffusion** with your photo to generate an anime portrait
2. Use **DeepMotion** or **Animated Drawings** (Meta AI, free) to add movement
3. Export as animated WebP or a sprite sheet
4. Display in your Electron window as an `<img>` with CSS animations instead of Live2D

**Why it's good:** Fastest, no 3D or Live2D knowledge needed
**Why it's limited:** Pre-baked animation, can't change expressions dynamically

---

### 🪜 Recommended Path: Option C for Now, Option B Later

For a 15-year-old builder, this is the most realistic path:

**Phase 5 (now):** Use hiyori — free, works, looks great ✅
**Future upgrade:** When you have more time, use VRoid Studio to design a custom avatar,
then come back and replace the model path in `Avatar.jsx` — it is literally 1 line change.

---

### 🛠️ If You Want to Use Option C Right Now

Here are the exact steps:

**Step 1 — Generate an anime portrait of yourself:**
Go to https://huggingface.co/spaces/AP123/IllusionDiffusion
Upload your photo, choose anime style, download the result.

**Step 2 — Make it move (Meta's Animated Drawings):**
Go to https://sketch.metademolab.com/
Upload your anime portrait, select movement type, download the animated version.

**Step 3 — Add it to your Electron app:**
Instead of the `<canvas>` in Avatar.jsx, use:
```jsx
<img
  src={jarvisImage}
  className="h-48 object-contain"
  style={{ filter: expression === "thinking" ? "hue-rotate(180deg)" : "none" }}
/>
```

Use CSS filters (`brightness`, `hue-rotate`, `saturate`) to simulate mood changes.

---

## 🔗 Phase 6 — LangGraph Agents

> **Stop after this phase and tell me "Phase 6 done" when finished!**

---

### 🎯 Goal

Replace the single `ChatAgent` with a **multi-agent system** using LangGraph.

By the end, JARVIS will have three specialised agents working as a team:

- **Planner** — receives the user's message and decides the plan
- **Chat agent** — handles pure conversation (Phase 2's ChatAgent, enhanced)
- **Safety agent** — reviews every plan before execution (no dangerous actions)

Each agent is a node in a **directed graph** — LangGraph manages the flow between them.

---

### 🤔 Why This Phase Matters

Right now JARVIS can only chat. To do things — open apps, automate tasks, control
your desktop — it needs to make decisions:

```
"Open Chrome and search for Python tutorials"
        ↓
Planner: "I need to open Chrome, then search"
        ↓
Safety:  "Opening Chrome is safe. Searching is safe. ✅ Approved."
        ↓
Desktop Agent: executes the plan step by step
```

A single agent trying to do all this gets confused. Three specialised agents,
each great at one job, is how real AI systems are built — this pattern is used
by Google, OpenAI, Anthropic, and every serious AI company.

**LangGraph** is the framework that wires them together. It was built by the same
team that made LangChain and is the industry standard for multi-agent AI systems.

---

### 🧠 Two Concepts to Understand First

#### 1. What is a Graph in LangGraph?

A **graph** is a flowchart for your agents. Each box (node) is an agent or step.
Each arrow (edge) says "after this step, go here next."

```
START
  ↓
[Planner Node]          ← decides: "is this a chat or a task?"
  ↓
[Router]                ← "chat" → ChatNode | "task" → SafetyNode
  ↓              ↓
[Chat Node]   [Safety Node]    ← safety checks the plan
  ↓              ↓
[END]         [END or retry]
```

#### 2. What is State?

The **state** is the shared memory all nodes can read and write.
Think of it as a whiteboard that each agent can read and update:

```python
class JARVISState(TypedDict):
    messages: list         # full conversation history
    user_input: str        # what the user typed
    plan: str              # the Planner's current plan
    safe_to_run: bool      # Safety agent's verdict
    final_reply: str       # what JARVIS sends back to the user
```

Every node receives the current state, does its job, and returns updated state.

---

### 🪜 Step-by-Step Instructions

---

#### Step 1 — Install LangGraph

```
uv add langgraph langchain-google-genai
```

**What these do:**

| Package | Purpose |
|---|---|
| `langgraph` | The graph framework — `StateGraph`, nodes, edges, routing |
| `langchain-google-genai` | LangChain wrapper for Gemini — lets LangGraph call Gemini |

Verify:
```
uv run python -c "import langgraph; print(langgraph.__version__)"
```

---

#### Step 2 — Create the Folder Structure

```
JARVIS/
└── agents/
    ├── chat/
    │   └── agent.py          ← already exists (your Phase 2 ChatAgent)
    └── graph/                ← NEW folder
        ├── __init__.py       ← empty
        ├── state.py          ← JARVISState TypedDict
        ├── nodes.py          ← planner_node, safety_node, chat_node
        └── graph.py          ← builds and compiles the StateGraph
```

---

#### Step 3 — Write `agents/graph/state.py`

```
PSEUDOCODE for agents/graph/state.py:

--- IMPORTS ---
Import: TypedDict from typing
Import: Annotated from typing
Import: add_messages from langgraph.graph.message

--- STATE CLASS ---
class JARVISState(TypedDict):

    messages: Annotated[list, add_messages]
        Purpose: full conversation history.
        Annotated with add_messages means LangGraph
        automatically appends new messages instead of replacing

    user_input: str
        Purpose: the raw string the user typed

    intent: str
        Purpose: "chat" or "task" — set by planner
        Default: "chat"

    plan: str
        Purpose: the Planner's description of what to do
        Default: "" (empty string)

    safe_to_run: bool
        Purpose: True if Safety agent approved the plan
        Default: True

    final_reply: str
        Purpose: the reply that goes back to the user
        Default: ""
```

---

#### Step 4 — Write `agents/graph/nodes.py`

```
PSEUDOCODE for agents/graph/nodes.py:
(Write Python yourself — read carefully!)

--- IMPORTS ---
Import: ChatGoogleGenerativeAI from langchain_google_genai
Import: HumanMessage, SystemMessage, AIMessage from langchain_core.messages
Import: JARVISState from .state
Import: GEMINI_API_KEY, AI_MODEL from core.config.settings

Create one LLM instance (reused by all nodes):
    llm = ChatGoogleGenerativeAI(
        model=AI_MODEL,
        google_api_key=GEMINI_API_KEY,
        temperature=0.7
    )

--- NODE 1: planner_node ---
def planner_node(state: JARVISState) -> dict:
    Purpose: Look at the user's message and decide:
             - intent = "chat"  if it's conversation
             - intent = "task"  if it needs desktop action (open app, search, etc.)

    Steps:
        1. Build a prompt:
           system = """
           You are a planner. Classify the user message as one of:
           - "chat": normal conversation, questions, or information requests
           - "task": requests to open apps, control the desktop, search web,
                     create files, or take any real-world action

           Respond with ONLY the single word: chat OR task
           """
           messages = [SystemMessage(system), HumanMessage(state["user_input"])]

        2. Call the LLM:
           response = llm.invoke(messages)

        3. Parse intent:
           intent = response.content.strip().lower()
           If intent is not "task": intent = "chat"  (default to chat if unclear)

        4. If intent is "task":
           Make another LLM call to create a plan description:
           plan_prompt = f"The user wants to: {state['user_input']}. Describe the steps needed in one sentence."
           plan = llm.invoke([HumanMessage(plan_prompt)]).content

        5. Return updated state:
           Return {"intent": intent, "plan": plan if task else ""}

--- NODE 2: chat_node ---
def chat_node(state: JARVISState) -> dict:
    Purpose: Handle pure conversation using the existing ChatAgent style.

    Steps:
        1. Build conversation prompt from state["messages"]
        2. Add system prompt: "You are JARVIS, a helpful AI desktop companion..."
        3. Call llm.invoke(messages)
        4. Get reply from response.content
        5. Return: {"final_reply": reply}

--- NODE 3: safety_node ---
def safety_node(state: JARVISState) -> dict:
    Purpose: Review the plan and approve or reject it.

    Steps:
        1. Build prompt:
           "Review this plan: '{state['plan']}'
            Is this safe to execute on a Windows desktop?
            Does it avoid deleting files, accessing passwords, or private data?
            Respond with ONLY: safe OR unsafe"

        2. Call LLM.

        3. Parse response:
           verdict = response.content.strip().lower()
           safe_to_run = (verdict == "safe")

        4. If not safe:
           Set final_reply = "I am not allowed to do that — it might be unsafe."

        5. Return: {"safe_to_run": safe_to_run, "final_reply": ...}

--- ROUTER FUNCTION ---
def route_after_planner(state: JARVISState) -> str:
    Purpose: Decides which node to go to after the planner.
             This is used as a conditional edge in the graph.

    If state["intent"] == "task":
        Return "safety"        <- route to safety check
    Else:
        Return "chat"          <- route to chat
```

---

#### Step 5 — Write `agents/graph/graph.py`

```
PSEUDOCODE for agents/graph/graph.py:

--- IMPORTS ---
Import: StateGraph, END from langgraph.graph
Import: JARVISState from .state
Import: planner_node, chat_node, safety_node, route_after_planner from .nodes

--- BUILD GRAPH ---
def build_graph():
    1. Create the graph:
       graph = StateGraph(JARVISState)

    2. Add nodes:
       graph.add_node("planner", planner_node)
       graph.add_node("chat",    chat_node)
       graph.add_node("safety",  safety_node)

    3. Set the entry point:
       graph.set_entry_point("planner")

    4. Add conditional edge after planner:
       graph.add_conditional_edges(
           "planner",              <- from this node
           route_after_planner,   <- call this function to decide
           {
               "chat":   "chat",   <- if function returns "chat" → go to chat node
               "safety": "safety", <- if returns "safety" → go to safety node
           }
       )

    5. Add final edges:
       graph.add_edge("chat",   END)   <- chat → done
       graph.add_edge("safety", END)   <- safety → done

    6. Compile and return:
       return graph.compile()

--- MODULE LEVEL ---
Create a compiled graph ready to use:
    jarvis_graph = build_graph()
```

---

#### Step 6 — Update `main.py` and `server.py` to Use the Graph

In `server.py`, update the `/chat` endpoint to call the graph instead of the ChatAgent directly:

```
PSEUDOCODE — change in server.py:

--- NEW IMPORT ---
Import: jarvis_graph from agents.graph.graph

--- CHANGE THE /chat ENDPOINT ---
Old code: reply = agent.chat(request.message)

New code:
    result = jarvis_graph.invoke({
        "user_input": request.message,
        "messages": [],
        "intent": "chat",
        "plan": "",
        "safe_to_run": True,
        "final_reply": "",
    })
    reply = result["final_reply"]

Keep the ChatAgent for the terminal mode — it's simpler and useful for testing.
The API now uses the graph, which adds Planner + Safety on top.
```

---

#### Step 7 — Test the Graph

```
uv run python -c "
from agents.graph.graph import jarvis_graph

# Test 1: Pure chat
result = jarvis_graph.invoke({
    'user_input': 'Hello! What is 2 + 2?',
    'messages': [],
    'intent': 'chat',
    'plan': '',
    'safe_to_run': True,
    'final_reply': '',
})
print('Chat reply:', result['final_reply'])
print('Intent detected:', result['intent'])

# Test 2: Task request
result2 = jarvis_graph.invoke({
    'user_input': 'Open Chrome and search for Python tutorials',
    'messages': [],
    'intent': 'chat',
    'plan': '',
    'safe_to_run': True,
    'final_reply': '',
})
print('Task intent:', result2['intent'])
print('Plan:', result2['plan'])
print('Safe:', result2['safe_to_run'])
"
```

---

#### Step 8 — Ruff and Commit

```
uv run ruff check .
uv run ruff format .
git add .
git commit -m "Phase 6: LangGraph multi-agent system (Planner + Chat + Safety)"
```

---

### 📁 Files Changed in Phase 6

| File | What Changed |
|------|-------------|
| `agents/graph/__init__.py` | New — empty module marker |
| `agents/graph/state.py` | New — JARVISState TypedDict |
| `agents/graph/nodes.py` | New — planner, chat, and safety nodes |
| `agents/graph/graph.py` | New — StateGraph assembly and compilation |
| `apps/desktop/backend/server.py` | Updated — /chat uses jarvis_graph |
| `pyproject.toml` | Updated — langgraph + langchain-google-genai added |

---

### ⚠️ Common Mistakes to Watch Out For

| Mistake | Why It's Bad | How to Avoid |
|---------|-------------|--------------|
| Using `langgraph` without `langchain-google-genai` | Gemini won't work with LangGraph | Install both together |
| Forgetting to add `agents` to hatchling packages | Import errors in production | Already set in pyproject.toml |
| Not adding default values to JARVISState | Graph crashes if a key is missing | Always add defaults: `"intent": "chat"` |
| Returning full state from a node | LangGraph merges — only return changed keys | Return only what the node modified |
| Planner saying "task" for everything | Safety runs when not needed, slows things down | Tune the planner system prompt carefully |

---

### ✅ Phase 6 Success Checklist

- [ ] 🟢 `uv run python -c "from agents.graph.graph import jarvis_graph; print('graph ok')"` works
- [ ] 🟢 Test script shows correct intent ("chat" for questions, "task" for actions)
- [ ] 🟢 Server's `/chat` endpoint uses the graph (test via `npm start`)
- [ ] 🟢 Safety agent rejects obviously unsafe requests
- [ ] 🟢 `uv run ruff check .` — zero errors
- [ ] 🟢 Git commit done

---

### 🎊 Phase 6 Celebration

JARVIS is no longer just a chatbot — it's a **multi-agent AI system**! 🔗

You have:
- A Planner that understands intent
- A Safety agent that protects the user
- A graph that routes intelligently
- The same architecture used by serious AI products at Google and OpenAI 🏆

---

### 🎉 When You Are Done

Tell me **"Phase 6 done!"** and we will move on to **Phase 7 — Laya Tool Registry** 🧰

In Phase 7 you will:
- Install and configure the Laya open-source tool execution layer
- Register your first desktop tools (open app, search, screenshot)
- Wire Laya into the LangGraph Safety + Desktop agents
- Every new JARVIS ability from here on = a new Laya tool file

---

*Phase 6 — last updated: Phase 6*
