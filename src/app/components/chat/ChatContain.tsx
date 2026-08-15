"use client";

import { useEffect, useState } from "react";

import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import Sidebar from "../sideber/Sideber";

import type {
  Conversation,
  Message,
} from "@/app/lib/types/chat";

export default function ChatContainer() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [
    activeConversationId,
    setActiveConversationId,
  ] = useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [loadingChats, setLoadingChats] =
    useState(true);

  /*
   * Load conversations
   */

  useEffect(() => {
    const loadChats = async () => {
      try {
        const response = await fetch(
          "/api/conversations",
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load conversations"
          );
        }

        setConversations(data);

        if (data.length > 0) {
          setActiveConversationId(
            data[0].id
          );
        }
      } catch (error) {
        console.error(
          "LOAD CHAT ERROR:",
          error
        );
      } finally {
        setLoadingChats(false);
      }
    };

    loadChats();
  }, []);

  /*
   * Active conversation
   */

  const activeConversation =
    conversations.find(
      (conversation) =>
        conversation.id ===
        activeConversationId
    );

  const messages: Message[] =
    activeConversation?.messages || [];

  /*
   * New chat
   */

  const handleNewChat = () => {
    setActiveConversationId(null);
  };

  /*
   * Select chat
   */

  const handleSelectChat = (
    id: string
  ) => {
    setActiveConversationId(id);
  };

  /*
   * SEND MESSAGE + FILE
   */

  const sendMessage = async (
    message: string,
    file?: File | null
  ) => {
    if (
      (!message.trim() && !file) ||
      loading
    ) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "message",
        message
      );

      if (activeConversationId) {
        formData.append(
          "conversationId",
          activeConversationId
        );
      }

      if (file) {
        formData.append(
          "file",
          file
        );
      }

      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Something went wrong"
        );
      }

      const conversationId =
        data.conversationId;

      /*
       * User message
       */

      const userMessage: Message = {
        id: Date.now(),
        role: "user",
        content:
          message ||
          `Uploaded: ${
            file?.name || "file"
          }`,
        fileName:
          file?.name,
        fileType:
          file?.type,
      };

      /*
       * Assistant message
       */

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply,
      };

      /*
       * New conversation
       */

      if (!activeConversationId) {
        const newConversation: Conversation =
          {
            id: conversationId,

            title:
              message ||
              file?.name ||
              "New Chat",

            messages: [
              userMessage,
              assistantMessage,
            ],
          };

        setConversations(
          (prev) => [
            newConversation,
            ...prev,
          ]
        );
      } else {
        /*
         * Existing conversation
         */

        setConversations(
          (prev) =>
            prev.map(
              (conversation) => {
                if (
                  conversation.id !==
                  conversationId
                ) {
                  return conversation;
                }

                return {
                  ...conversation,

                  messages: [
                    ...conversation.messages,

                    userMessage,

                    assistantMessage,
                  ],
                };
              }
            )
        );
      }

      setActiveConversationId(
        conversationId
      );
    } catch (error) {
      console.error(
        "SEND MESSAGE ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingChats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-zinc-500">
          Loading chats...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100">

     <Sidebar
  conversations={conversations}
  activeConversationId={
    activeConversationId
  }
  onNewChat={handleNewChat}
  onSelectChat={handleSelectChat}

  onConversationDeleted={(id) => {
    setConversations((prev) =>
      prev.filter(
        (conversation) =>
          conversation.id !== id
      )
    );

    /*
     * যদি deleted chat-টাই active হয়
     */
    if (
      activeConversationId === id
    ) {
      setActiveConversationId(null);
    }
  }}

  onConversationRenamed={(
    id,
    title
  ) => {
    setConversations((prev) =>
      prev.map(
        (conversation) =>
          conversation.id === id
            ? {
                ...conversation,
                title,
              }
            : conversation
      )
    );
  }}
/>

      <div className="flex min-w-0 flex-1 flex-col">

        <header className="border-b bg-white px-6 py-4">
          <h1 className="text-xl font-bold text-zinc-900">
            Amit Mahmud Amil&apos;s AI
          </h1>

          <p className="text-sm text-zinc-500">
            Your personal AI assistant
          </p>
        </header>

        <MessageList
          messages={messages}
          loading={loading}
        />

        <ChatInput
          onSend={sendMessage}
          loading={loading}
        />

      </div>
    </div>
  );
}