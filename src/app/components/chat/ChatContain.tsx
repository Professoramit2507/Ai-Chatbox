"use client";

import { useState } from "react";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

export type MessageType = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function ChatContainer() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message: string) => {
    if (!message.trim() || loading) return;

    const userMessage: MessageType = {
      id: Date.now(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await response.json();

      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong"
        );
      }

      const assistantMessage: MessageType = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("CHAT ERROR:", error);

      const errorMessage: MessageType = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col">
      {/* Header */}
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-zinc-900">
          Amit Mahmud Amil AI Chatbot
        </h1>

        <p className="text-sm text-zinc-500">
          Powered by ProfessorAmit
        </p>
      </header>

      {/* Messages */}
      <MessageList
        messages={messages}
        loading={loading}
      />

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        loading={loading}
      />
    </div>
  );
}