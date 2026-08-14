"use client";

import { Plus } from "lucide-react";

type NewChatButtonProps = {
  onNewChat: () => void;
};

export default function NewChatButton({
  onNewChat,
}: NewChatButtonProps) {
  return (
    <button
      onClick={onNewChat}
      className="flex w-full items-center gap-3 rounded-xl border border-zinc-700 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
    >
      <Plus size={18} />
      <span>New Chat</span>
    </button>
  );
}