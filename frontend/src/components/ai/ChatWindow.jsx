import { useState } from "react";
import axios from "axios";
import {Bot, Send, X} from "lucide-react";
import * as api from '../../api'

import MessageBubble from "./MessageBubble";

export default function ChatWindow({onClose}) {
  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
      {
        role: "assistant",
        content:
          "Hi! I can analyze your expenses, groups, balances and spending habits.",
      },
    ]);

  const sendMessage = async (text = question) => {
    if (!text.trim()) return;

    const token = JSON.parse(localStorage.getItem("profile"))?.accessToken;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
      },
    ]);

    setQuestion("");

    setLoading(true);

    try {
      const response = await api.aiChat({question: text})

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.answer,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="fixed top-20 bottom-24 right-6 z-9999 flex w-105 flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
      {/* Header */}

      <div
        className="flex items-center justify-between bg-blue-600 px-4 py-4 text-white"
      >
        <div className="flex items-center gap-2">
          <Bot size={22} />

          <span className="font-semibold">
            Hisaab AI
          </span>
        </div>

        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      
      {/* Messages */}

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            role={msg.role}
            content={msg.content}
          />
        ))}

        {loading && (
          <div className="text-sm text-gray-500">
            Thinking...
          </div>
        )}
      </div>

      {/* Input */}

      <div className="border-t p-3">
        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {if (e.key === "Enter") sendMessage();}}
            placeholder="Ask about your expenses..."
            className="flex-1 rounded-lg border px-4 py-3 outline-none"
          />

          <button
            onClick={() => sendMessage()}
            className="rounded-lg bg-blue-600 px-4 text-white"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}