import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import * as api from "../../api";

import MessageBubble from "./MessageBubble";

export default function ChatWindow({ onClose }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I can help with your groups, balances, expenses and spending.",
    },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = question.trim();
    if (!text || loading) return;

    const history = messages.slice(-14).map(({ role, content }) => ({ role, content }));
    setMessages((previous) => [...previous, { role: "user", content: text }]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await api.aiChat({ message: text, history });
      const answer = response.data?.answer?.trim();
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: answer || "I couldn't find an answer. Please try asking another way.",
        },
      ]);
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: error.response?.data?.message || "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-x-4 top-20 bottom-24 z-[9999] flex flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl sm:inset-x-auto sm:right-6 sm:w-[26rem]">
      <div className="flex items-center justify-between bg-blue-600 px-4 py-4 text-white">
        <div className="flex items-center gap-2">
          <Bot size={22} />
          <span className="font-semibold">HisabWise AI</span>
        </div>
        <button type="button" onClick={onClose} aria-label="Close chat">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <MessageBubble
            key={index}
            role={msg.role}
            content={msg.content}
          />
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500" role="status">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3">
        <form className="flex gap-2" onSubmit={sendMessage}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your expenses..."
            aria-label="Ask HisabWise AI"
            disabled={loading}
            className="min-w-0 flex-1 rounded-lg border px-4 py-3 outline-none focus:border-blue-500 disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            aria-label="Send message"
            className="rounded-lg bg-blue-600 px-4 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}