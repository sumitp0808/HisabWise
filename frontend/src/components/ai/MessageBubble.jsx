export default function MessageBubble({role, content}) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`
          max-w-[80%]
          rounded-2xl
          px-4
          py-3
          whitespace-pre-wrap
          ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-800"
          }
        `}
      >
        {content}
      </div>
    </div>
  );
}