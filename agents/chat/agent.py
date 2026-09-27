from google import genai
from google.genai import types

from core.config.settings import AI_MODEL, GEMINI_API_KEY

_client = genai.Client(api_key=GEMINI_API_KEY)

JARVIS_SYSTEM_PROMPT = (
    "You are JARVIS (Just A Rather Very Intelligent System), "
    "an intelligent AI desktop companion with an anime-style avatar. "
    "You are helpful, friendly, and slightly witty. "
    "You have three modes: Chat Mode (conversation), "
    "Guide Mode (step-by-step visual help on the real screen), "
    "and JARVIS Mode (autonomous actions with explicit user permission). "
    "Right now you are in Chat Mode. "
    "Always be concise, clear, and encouraging. "
    "If the user seems confused, ask a simple question to help them think it through."
)


class ChatAgent:
    def __init__(self) -> None:
        # The new SDK keeps history in a Chat object
        self.chat_session = _client.chats.create(
            model=AI_MODEL,
            config=types.GenerateContentConfig(
                system_instruction=JARVIS_SYSTEM_PROMPT,
            ),
        )
        self.message_count = 0
        print("JARVIS ChatAgent initialised. Ready to chat!")

    def chat(self, user_message: str) -> str:
        """Send one message and return reply. History is kept automatically."""
        if not user_message.strip():
            return "I did not catch that. Could you say it again?"
        self.message_count += 1
        try:
            response = self.chat_session.send_message(user_message)
            return response.text.strip()
        except Exception as error:
            print(f"Gemini error: {error}")
            return "Sorry, having trouble thinking right now. Please try again!"

    def clear_history(self) -> None:
        """Reset the conversation -- start fresh."""
        self.chat_session = _client.chats.create(
            model=AI_MODEL,
            config=types.GenerateContentConfig(
                system_instruction=JARVIS_SYSTEM_PROMPT,
            ),
        )
        self.message_count = 0
        print("Conversation history cleared.")

    def get_message_count(self) -> int:
        """How many messages have been sent this session?"""
        return self.message_count
