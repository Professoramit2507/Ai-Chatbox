type MessageProps = {
  role: "user" | "assistant";
  content: string;
};

export default function Message({
  role,
  content,
}: MessageProps) {
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
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-black text-white"
            : "bg-white text-zinc-800 shadow-sm"
        }`}
      >
        <p className="whitespace-pre-wrap text-sm leading-6">
          {content}
        </p>
      </div>
    </div>
  );
}