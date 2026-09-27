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
