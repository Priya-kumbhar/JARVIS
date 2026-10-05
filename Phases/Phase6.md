# 🔗 Phase 6 — LangGraph Multi-Agent System

> **Stop after this phase and tell me "Phase 6 done!" when finished!**

---

## 🎯 Goal

Replace the single `ChatAgent` with a **multi-agent system** using LangGraph.

By the end of this phase, JARVIS has three specialised agents working as a team:

| Agent | Job |
|-------|-----|
| **Planner** | Reads the user's message, decides the *intent* (`chat` vs `task`) and writes a plan |
| **Chat Agent** | Handles pure conversation — same Gemini brain, but wired into the graph |
| **Safety Agent** | Reviews every plan before execution — rejects dangerous or unclear actions |

```
User types "Open Chrome and search Python tutorials"
        ↓
[Planner]  →  intent="task", plan="1. Open Chrome  2. Search for Python tutorials"
        ↓
[Safety]   →  "Both steps are safe." → safe_to_run=True
        ↓
[END]      →  final_reply sent back to the UI
         (Desktop automation comes in Phase 9 — for now Safety just approves/rejects)
```

---

## 🤔 Why This Phase Matters

Right now JARVIS can only chat.
To **do things** — open apps, control the desktop, search the web — it needs a
decision layer. A single agent doing everything gets confused.

LangGraph gives you a **directed graph**: each node is one agent, each arrow says
"after this step, go here next." It is the same architecture used at Google DeepMind,
OpenAI, and Anthropic. Learning it now puts you ahead of most developers.

---

## 🧠 Core Concepts Before You Start

### What is a Graph?

Think of a flowchart where each box is an agent and each arrow is a route.

```
START
  │
  ▼
[Planner] ──"chat"──▶ [Chat Agent] ──▶ END
    │
   "task"
    │
    ▼
[Safety Agent] ──▶ END
```

### What is State?

State is a **shared whiteboard** that every agent can read and update.
It travels through the graph — each agent adds its piece.

```python
class JARVISState(TypedDict):
    messages:    list   # full conversation history
    user_input:  str    # what the user typed
    intent:      str    # "chat" or "task" — set by Planner
    plan:        str    # Planner's step-by-step plan
    safe_to_run: bool   # Safety agent's verdict
    final_reply: str    # what goes back to the user
```

### What is a Node?

A node is just a Python function:
```
def my_node(state: JARVISState) -> dict:
    # read from state
    # do something
    # return only the keys you changed
    return {"final_reply": "hello"}
```

---

## 🪜 Step-by-Step Instructions

---

### Step 1 — Install LangGraph

```
uv add langgraph langchain-google-genai
```

Verify:
```
uv run python -c "import langgraph; print('LangGraph', langgraph.__version__)"
```

---

### Step 2 — Create the Folder Structure

```
JARVIS/
└── agents/
    ├── chat/
    │   └── agent.py        ← already exists (Phase 2)
    └── graph/              ← NEW
        ├── __init__.py     ← empty file
        ├── state.py        ← JARVISState TypedDict
        ├── nodes.py        ← planner_node, chat_node, safety_node
        └── graph.py        ← builds and compiles the StateGraph
```

---

### Step 3 — Write `agents/graph/__init__.py`

This file stays empty. It just tells Python that `graph` is a module.

---

### Step 4 — Write `agents/graph/state.py`

```
PSEUDOCODE for agents/graph/state.py:

IMPORTS:
    TypedDict from typing
    Annotated from typing
    add_messages from langgraph.graph.message

CLASS JARVISState(TypedDict):

    messages: Annotated[list, add_messages]
        → full conversation history
        → Annotated with add_messages so LangGraph APPENDS new messages
          instead of replacing the whole list

    user_input: str
        → the raw string the user typed

    intent: str
        → "chat" or "task"
        → set by the Planner node

    plan: str
        → the Planner's written plan (only filled for "task" intents)

    safe_to_run: bool
        → True = Safety agent approved, False = rejected

    final_reply: str
        → the reply that goes back to the UI via the /chat endpoint
```

---

### Step 5 — Write `agents/graph/nodes.py`

```
PSEUDOCODE for agents/graph/nodes.py:

IMPORTS:
    ChatGoogleGenerativeAI from langchain_google_genai
    HumanMessage, SystemMessage from langchain_core.messages
    JARVISState from .state
    GEMINI_API_KEY, AI_MODEL from core.config.settings

CREATE one shared LLM instance (all nodes reuse it):
    llm = ChatGoogleGenerativeAI(
        model=AI_MODEL,
        google_api_key=GEMINI_API_KEY,
        temperature=0.7
    )

────────────────────────────────────────────────────
NODE 1: planner_node(state: JARVISState) → dict
────────────────────────────────────────────────────
Purpose: Classify the user's message as "chat" or "task"

Steps:
    1. Build messages:
       system = """
           You are an intent classifier. Reply with ONLY one word:
           - "chat"  → if the user wants conversation or information
           - "task"  → if they want you to DO something (open apps,
                       search, take screenshots, create files, etc.)
       """
       msgs = [SystemMessage(system), HumanMessage(state["user_input"])]

    2. Call LLM:
       response = llm.invoke(msgs)
       intent = response.content.strip().lower()
       if intent not in ("chat", "task"):
           intent = "chat"   # default to chat if unclear

    3. If intent == "task": write a plan
       plan_prompt = (
           f"The user wants to: {state['user_input']}\n"
           "List the steps needed in ONE short sentence."
       )
       plan = llm.invoke([HumanMessage(plan_prompt)]).content
    else:
       plan = ""

    4. Return:
       {"intent": intent, "plan": plan}

────────────────────────────────────────────────────
NODE 2: chat_node(state: JARVISState) → dict
────────────────────────────────────────────────────
Purpose: Handle pure conversation, using the message history

Steps:
    1. Build the full message list from state["messages"]
       Prepend a SystemMessage:
       "You are JARVIS, a friendly and intelligent AI desktop companion.
        Keep answers concise but helpful."

    2. Call LLM with the messages

    3. Return:
       {"final_reply": response.content}

────────────────────────────────────────────────────
NODE 3: safety_node(state: JARVISState) → dict
────────────────────────────────────────────────────
Purpose: Review the plan and approve or reject it

Steps:
    1. Build prompt:
       "Review this plan: '{state['plan']}'
        Is it safe to run on a Windows desktop?
        Does it avoid: deleting files, passwords, private data, system changes?
        Reply with ONLY: safe OR unsafe"

    2. Call LLM

    3. Parse:
       verdict = response.content.strip().lower()
       safe_to_run = (verdict == "safe")

    4. If safe:
       final_reply = (
           f"I understand! Here's my plan:\n{state['plan']}\n\n"
           "(Desktop execution coming in Phase 9! 🚀)"
       )
    else:
       final_reply = (
           "I can't do that — it might be unsafe or I'm not allowed to. "
           "Please rephrase what you need!"
       )

    5. Return:
       {"safe_to_run": safe_to_run, "final_reply": final_reply}

────────────────────────────────────────────────────
ROUTER FUNCTION: route_after_planner(state) → str
────────────────────────────────────────────────────
Purpose: Tells LangGraph which node to visit after the Planner

    If state["intent"] == "task":
        return "safety"
    Else:
        return "chat"
```

---

### Step 6 — Write `agents/graph/graph.py`

```
PSEUDOCODE for agents/graph/graph.py:

IMPORTS:
    StateGraph, END from langgraph.graph
    JARVISState from .state
    planner_node, chat_node, safety_node, route_after_planner from .nodes

FUNCTION build_graph():

    1. Create graph:
       graph = StateGraph(JARVISState)

    2. Add nodes:
       graph.add_node("planner", planner_node)
       graph.add_node("chat",    chat_node)
       graph.add_node("safety",  safety_node)

    3. Set entry point:
       graph.set_entry_point("planner")

    4. Add conditional edge from planner:
       graph.add_conditional_edges(
           "planner",
           route_after_planner,
           {"chat": "chat", "safety": "safety"}
       )

    5. Both branches end the graph:
       graph.add_edge("chat",   END)
       graph.add_edge("safety", END)

    6. Compile and return:
       return graph.compile()

At module level (outside the function):
    jarvis_graph = build_graph()
```

---

### Step 7 — Update `apps/desktop/backend/server.py`

Wire the graph into the `/chat` API endpoint.

```
PSEUDOCODE — changes to server.py:

NEW IMPORT at the top:
    from agents.graph.graph import jarvis_graph

IN THE /chat ENDPOINT:
    (Replace: reply = agent.chat(request.message))

    New code:
        initial_state = {
            "user_input":  request.message,
            "messages":    [],
            "intent":      "chat",
            "plan":        "",
            "safe_to_run": True,
            "final_reply": "",
        }
        result = jarvis_graph.invoke(initial_state)
        reply  = result["final_reply"]

Keep the ChatAgent for terminal mode (main.py) — it is simpler and
great for debugging. The graph only runs via the FastAPI server.
```

---

### Step 8 — Test the Graph Directly

Before connecting it to the server, test it in isolation:

```
uv run python -c "
from agents.graph.graph import jarvis_graph

# Test 1 — Pure chat
r = jarvis_graph.invoke({
    'user_input': 'What is 2 + 2?',
    'messages': [], 'intent': 'chat',
    'plan': '', 'safe_to_run': True, 'final_reply': ''
})
print('--- TEST 1: CHAT ---')
print('Intent:', r['intent'])
print('Reply:', r['final_reply'])

# Test 2 — Task request
r2 = jarvis_graph.invoke({
    'user_input': 'Open Chrome and search for Python tutorials',
    'messages': [], 'intent': 'chat',
    'plan': '', 'safe_to_run': True, 'final_reply': ''
})
print()
print('--- TEST 2: TASK ---')
print('Intent:', r2['intent'])
print('Plan:', r2['plan'])
print('Safe:', r2['safe_to_run'])
print('Reply:', r2['final_reply'])
"
```

✅ Expected results:
- Test 1: `intent = "chat"`, reply is an actual answer
- Test 2: `intent = "task"`, plan has steps, reply shows the plan

---

### Step 9 — Ruff and Commit

```
uv run ruff check .
uv run ruff format .
git add .
git commit -m "Phase 6: LangGraph multi-agent system (Planner + Chat + Safety)"
git push
```

---

## 📁 New Files in Phase 6

| File | Purpose |
|------|---------|
| `agents/graph/__init__.py` | Module marker (empty) |
| `agents/graph/state.py` | `JARVISState` TypedDict — the shared whiteboard |
| `agents/graph/nodes.py` | Three agent nodes + router function |
| `agents/graph/graph.py` | Assembles and compiles the StateGraph |
| `apps/desktop/backend/server.py` | Updated `/chat` endpoint to use graph |

---

## ⚠️ Common Mistakes

| Mistake | Why It's Bad | How to Avoid |
|---------|-------------|--------------|
| Returning full state from a node | LangGraph merges — only return changed keys | Return only `{"intent": ...}` not the whole dict |
| Using `from agents.graph.nodes import *` | Name conflicts | Import exactly what you need |
| Forgetting `__init__.py` | `ModuleNotFoundError` | Empty file is enough |
| Using `model=AI_MODEL` without the `models/` prefix | Some LangChain wrappers need `"models/gemini-2.5-flash"` | Try both if you get a 404 |
| Planner says "task" for everything | Safety runs unnecessarily, slow | Tune the system prompt with more examples |

---

## ✅ Phase 6 Success Checklist

- [ ] 🟢 `uv run python -c "from agents.graph.graph import jarvis_graph"` — no errors
- [ ] 🟢 Test script: intent is "chat" for questions, "task" for action requests
- [ ] 🟢 Safety agent rejects clearly dangerous requests
- [ ] 🟢 `/chat` API endpoint returns replies from the graph (test via `npm start`)
- [ ] 🟢 `uv run ruff check .` — zero errors
- [ ] 🟢 Git commit + push done

---

## 🎊 What You Have After Phase 6

JARVIS is now a **multi-agent AI system** — the same architecture pattern used in
production AI products at every major tech company. You built it from scratch. 🏆

Your JARVIS now has:
- ✅ A Live2D anime companion face (Phase 5)
- ✅ A Planner that classifies every message
- ✅ A Safety agent that protects the user
- ✅ A graph that routes intelligently between agents
- ✅ FastAPI + Electron UI showing real AI replies

---

## 🎉 When Done

Tell me **"Phase 6 done!"** and we move to **Phase 7 — Laya Tool Registry** 🧰

In Phase 7 you will install and configure Laya — the open-source tool execution layer.
Every desktop action JARVIS can do (open apps, take screenshots, search the web)
will be registered as a Laya tool. Adding a new JARVIS ability = adding one new file.

---

*Phase 6 — LangGraph Agents*
