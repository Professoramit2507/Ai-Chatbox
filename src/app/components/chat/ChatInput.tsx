"use client";

import { FormEvent, useState } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
  loading: boolean;
};

export default function ChatInput({
  onSend,
  loading,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    onSend(message);
    setMessage("");
  };

  return (
    <div className="border-t bg-white p-4">
      <form
        onSubmit={handleSubmit}
        className="flex gap-3"
      >
        <input
          type="text"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Ask me anything..."
          disabled={loading}
          className="flex-1 rounded-xl border text-black border-zinc-300 px-4 py-3 outline-none focus:border-black disabled:bg-zinc-100"
        />

        <button
          type="submit"
          disabled={
            loading || !message.trim()
          }
          className="rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}