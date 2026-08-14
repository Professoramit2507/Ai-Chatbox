"use client";

import { MessageSquare } from "lucide-react";
import type { Conversation } from "@/app/lib/types/chat";

type ChatHistoryProps = {
  conversations: Conversation[];
  activeConversationId: number | null;
  onSelectChat: (id: number) => void;
};

export default function ChatHistory({
  conversations,
  activeConversationId,
  onSelectChat,
}: ChatHistoryProps) {
  return (
    <div className="mt-6">
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Recent Chats
      </p>

      <div className="space-y-1">
        {conversations.length === 0 ? (
          <p className="px-2 py-3 text-sm text-zinc-600">
            No conversations yet
          </p>
        ) : (
          conversations.map((conversation) => {
            const isActive =
              conversation.id === activeConversationId;

            return (
              <button
                key={conversation.id}
                onClick={() =>
                  onSelectChat(conversation.id)
                }
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <MessageSquare
                  size={17}
                  className="shrink-0"
                />

                <span className="truncate">
                  {conversation.title}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}