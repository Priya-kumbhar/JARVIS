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
