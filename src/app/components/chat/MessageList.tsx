"use client";

import type { Message } from "@/app/lib/types/chat";
import MessageComponent from "./Message";

type MessageListProps = {
  messages: Message[];
  loading: boolean;
};

export default function MessageList({
  messages,
  loading,
}: MessageListProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-zinc-50 px-4 py-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-zinc-800">
                How can I help you?
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Start a conversation with
                Amit AI
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
            />
          ))
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.15s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}