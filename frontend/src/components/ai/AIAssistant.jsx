import { useState } from "react";
import { Bot } from "lucide-react";
import ChatWindow from "./ChatWindow";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="
          fixed
          bottom-6
          right-6
          z-50
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-blue-600
          text-white
          shadow-lg
          hover:bg-blue-700
        "
      >
        <Bot size={30} />
      </button>

      {open && (
        <ChatWindow
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}