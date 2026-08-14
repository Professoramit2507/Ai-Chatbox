"use client";

import type { Message as MessageType } from "@/app/lib/types/chat";

type MessageProps = {
  message: MessageType;
};

export default function Message({
  message,
}: MessageProps) {
  const isUser =
    message.role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "rounded-br-md bg-zinc-900 text-white"
            : "rounded-bl-md border bg-white text-zinc-800 shadow-sm"
        }`}
      >
        <p className="whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
}