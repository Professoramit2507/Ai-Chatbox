import Message from "./Message";
import type { MessageType } from "../../components/chat/ChatContain";

type MessageListProps = {
  messages: MessageType[];
  loading: boolean;
};

export default function MessageList({
  messages,
  loading,
}: MessageListProps) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-6">
      {messages.length === 0 && (
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-5xl">
              🤖
            </div>

            <h2 className="text-2xl font-bold text-zinc-800">
              How can I help you?
            </h2>

            <p className="mt-2 text-zinc-500">
              Start a conversation with Amit's chatbox.
            </p>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <Message
          key={message.id}
          role={message.role}
          content={message.content}
        />
      ))}

      {loading && (
        <div className="flex justify-start">
          <div className="rounded-2xl bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm">
            Amit's chatbox is typing...
          </div>
        </div>
      )}
    </div>
  );
}