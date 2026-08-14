"use client";

import { Bot, Menu, X } from "lucide-react";
import { useState } from "react";
import NewChatButton from "../sideber/NewChatBtn";
import ChatHistory from "./ChatHistory";
import type { Conversation } from "@/app/lib/types/chat";

type SidebarProps = {
  conversations: Conversation[];
  activeConversationId: number | null;
  onNewChat: () => void;
  onSelectChat: (id: number) => void;
};

export default function Sidebar({
  conversations,
  activeConversationId,
  onNewChat,
  onSelectChat,
}: SidebarProps) {
  const [open, setOpen] = useState(false);

  const handleSelectChat = (id: number) => {
    onSelectChat(id);
    setOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-zinc-900 p-2 text-white md:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-zinc-950 p-4 transition-transform duration-300 md:static md:z-auto md:translate-x-0 ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
              <Bot size={21} />
            </div>

            <div>
              <h1 className="font-semibold text-white">
                 Amit Mahmud Amil's Ai
              </h1>

              <p className="text-xs text-zinc-500">
                AI Assistant
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="text-zinc-400 hover:text-white md:hidden"
          >
            <X size={21} />
          </button>
        </div>

        {/* New Chat */}
        <NewChatButton
          onNewChat={() => {
            onNewChat();
            setOpen(false);
          }}
        />

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          <ChatHistory
            conversations={conversations}
            activeConversationId={
              activeConversationId
            }
            onSelectChat={handleSelectChat}
          />
        </div>

        {/* User */}
        <div className="border-t border-zinc-800 pt-4">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-white">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                User
              </p>

              <p className="text-xs text-zinc-500">
                Free Plan
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}