import { useEffect, useRef, useState } from "react";
import "./index.css";
import Avatar from "./Avatar";

const API_URL = "http://127.0.0.1:8000";

const WELCOME = {
  id: 0,
  role: "jarvis",
  text: "Hello! I am JARVIS. How can I help you today?",
};

export default function App() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const [avatarExpression, setAvatarExpression] = useState("idle");

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${API_URL}/health`);
        setIsConnected(res.ok);
      } catch {
        setIsConnected(false);
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 10_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text },
    ]);
    setInput("");
    setIsLoading(true);
    setAvatarExpression("thinking")

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "jarvis", text: data.reply },
      ]);
      let expressArr=["great", "happy", "done", "sure", "love"]
      if (expressArr.some((key)=>data.reply.includes(key))){
        setAvatarExpression("happy")
      }else{
        setAvatarExpression("speaking")
      }
      setTimeout(()=>{
        setAvatarExpression("idle")
      },3000)
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "jarvis",
          text: "I lost connection to my brain. Is the Python server running?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0d0d17]/95 border border-[#6b4fff]/30 rounded-xl text-[#e8e8f0] overflow-hidden select-none">

      <header className="flex items-center justify-between px-4 py-3 bg-[#14141f]/90 border-b border-[#6b4fff]/20 shrink-0">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-widest uppercase">
          <span className="text-xl">🤖</span>
          <span>JARVIS</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span
            className={`w-2 h-2 rounded-full transition-all ${
              isConnected
                ? "bg-emerald-400 shadow-[0_0_6px_#4ade80]"
                : "bg-red-400"
            }`}
          />
          <span>{isConnected ? "Connected" : "Offline"}</span>
        </div>
      </header>
      <Avatar expression={avatarExpression}/>
      <div className="messages-pane flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <div
              key={msg.id}
              className="msg-enter self-end max-w-[78%] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm leading-relaxed bg-gradient-to-br from-[#6b4fff] to-[#9b59ff] text-white"
            >
              {msg.text}
            </div>
          ) : (
            <div
              key={msg.id}
              className="msg-enter self-start max-w-[78%] px-4 py-2.5 rounded-2xl rounded-bl-sm text-sm leading-relaxed bg-[#28283c]/90 border border-[#6b4fff]/15 text-[#e0e0f0]"
            >
              {msg.text}
            </div>
          )
        )}

        {isLoading && (
          <div className="self-start px-4 py-3 rounded-2xl rounded-bl-sm bg-[#28283c]/90 border border-[#6b4fff]/15 flex gap-1 items-center">
            <span className="dot-1 w-1.5 h-1.5 rounded-full bg-[#9b59ff]" />
            <span className="dot-2 w-1.5 h-1.5 rounded-full bg-[#9b59ff]" />
            <span className="dot-3 w-1.5 h-1.5 rounded-full bg-[#9b59ff]" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-end gap-2 px-4 py-3 bg-[#0f0f19]/90 border-t border-[#6b4fff]/20 shrink-0">
        <textarea
          className="flex-1 bg-[#1e1e32]/80 border border-[#6b4fff]/25 rounded-xl text-[#e0e0f0] text-sm px-3.5 py-2.5 resize-none min-h-[44px] max-h-[120px] outline-none placeholder-gray-500 focus:border-[#6b4fff]/60 transition-colors font-inherit"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Talk to JARVIS…"
          rows={1}
          disabled={isLoading}
        />
        <button
          className="bg-gradient-to-br from-[#6b4fff] to-[#9b59ff] text-white text-sm font-semibold px-5 py-2.5 rounded-xl min-w-[64px] cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:not-disabled:brightness-110 hover:not-disabled:-translate-y-px"
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}