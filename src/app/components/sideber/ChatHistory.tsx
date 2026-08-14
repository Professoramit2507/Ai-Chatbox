"use client";

import { MessageSquare } from "lucide-react";

type ChatHistoryProps = {
  chats: string[];
  activeChat: number;
  onSelectChat: (index: number) => void;
};

export default function ChatHistory({
  chats,
  activeChat,
  onSelectChat,
}: ChatHistoryProps) {
  return (
    <div className="mt-6">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Recent Chats
      </p>

      <div className="space-y-1">
        {chats.map((chat, index) => (
          <button
            key={index}
            onClick={() => onSelectChat(index)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
              activeChat === index
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
          >
            <MessageSquare size={17} />

            <span className="truncate">
              {chat}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}