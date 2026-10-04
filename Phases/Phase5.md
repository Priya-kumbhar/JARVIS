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
