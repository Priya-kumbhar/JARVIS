import os
from pathlib import Path

from dotenv import load_dotenv

# Always find .env relative to this file's location (settings.py is 2 dirs deep)
_ROOT = Path(__file__).resolve().parent.parent.parent
load_dotenv(_ROOT / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # backup — can be None
JARVIS_MODE = os.getenv("JARVIS_MODE", "development")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
AI_MODEL = "gemini-2.0-flash"  # current recommended free-tier model (new SDK)

if GEMINI_API_KEY is None:
    raise ValueError(
        "GEMINI_API_KEY not found! Did you create your .env file?\n"
        f"Expected location: {_ROOT / '.env'}"
    )
