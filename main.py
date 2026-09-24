import sys

from rich.console import Console
from rich.panel import Panel
from rich.text import Text

from agents.chat.agent import ChatAgent

console = Console()


def main() -> None:
    # ── Server mode: must be checked BEFORE anything else ────────────────────
    if "--server" in sys.argv:
        import uvicorn

        console.print(Panel("[bold green]JARVIS Backend Server[/bold green]"))
        console.print("Starting on [link]http://127.0.0.1:8000[/link]")
        console.print("API docs at [link]http://127.0.0.1:8000/docs[/link]")
        uvicorn.run(
            "apps.desktop.backend.server:app",
            host="127.0.0.1",
            port=8000,
            # reload=True causes subprocess to lose .env — disabled for now
        )
        return  # stop here — do not run the terminal chat loop

    # ── Terminal chat mode ────────────────────────────────────────────────────
    console.print(
        Panel(
            Text(
                "JARVIS v0.1.0 — Chat Mode\n\n"
                "Type 'exit' to quit  |  Type 'clear' to reset conversation"
            )
        )
    )
    agent = ChatAgent()
    console.print("JARVIS is ready. Say something!")

    while True:
        user_input = input("You: ").strip()

        if not user_input:
            continue

        if user_input.lower() in ("exit", "quit"):
            console.print("JARVIS: Goodbye! Shutting down... 👋")
            break

        if user_input.lower() == "clear":
            agent.clear_history()
            console.print("JARVIS: Memory cleared! Fresh start.")
            continue

        reply = agent.chat(user_input)
        console.print(f"JARVIS: {reply}")


if __name__ == "__main__":
    main()
