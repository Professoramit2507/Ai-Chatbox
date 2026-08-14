// "use client";

// import { useState } from "react";
// import ChatInput from "./ChatInput";
// import MessageList from "./MessageList";
// import Sidebar from "../sideber/Sideber";
// import type {
//   Conversation,
//   Message,
// } from "@/app/lib/types/chat";

// export default function ChatContainer() {
//   const [conversations, setConversations] =
//     useState<Conversation[]>([]);

//   const [activeConversationId, setActiveConversationId] =
//     useState<number | null>(null);

//   const [loading, setLoading] = useState(false);

//   /*
//    * Active conversation
//    */
//   const activeConversation =
//     conversations.find(
//       (conversation) =>
//         conversation.id === activeConversationId
//     );

//   const messages: Message[] =
//     activeConversation?.messages || [];

//   /*
//    * New Chat
//    */
//   const handleNewChat = () => {
//     const newConversation: Conversation = {
//       id: Date.now(),
//       title: "New Chat",
//       messages: [],
//     };

//     setConversations((prev) => [
//       newConversation,
//       ...prev,
//     ]);

//     setActiveConversationId(newConversation.id);
//   };

//   /*
//    * Select Chat
//    */
//   const handleSelectChat = (id: number) => {
//     setActiveConversationId(id);
//   };

//   /*
//    * Send Message
//    */
//   const sendMessage = async (message: string) => {
//     if (!message.trim() || loading) return;

//     /*
//      * যদি কোনো chat select করা না থাকে,
//      * automatically নতুন chat তৈরি হবে।
//      */
//     let conversationId =
//       activeConversationId;

//     if (!conversationId) {
//       const newConversation: Conversation = {
//         id: Date.now(),
//         title: message.slice(0, 30),
//         messages: [],
//       };

//       conversationId = newConversation.id;

//       setConversations((prev) => [
//         newConversation,
//         ...prev,
//       ]);

//       setActiveConversationId(
//         conversationId
//       );
//     }

//     /*
//      * User Message
//      */
//     const userMessage: Message = {
//       id: Date.now(),
//       role: "user",
//       content: message,
//     };

//     setConversations((prev) =>
//       prev.map((conversation) => {
//         if (
//           conversation.id !== conversationId
//         ) {
//           return conversation;
//         }

//         const updatedTitle =
//           conversation.messages.length === 0
//             ? message.slice(0, 30)
//             : conversation.title;

//         return {
//           ...conversation,
//           title: updatedTitle,
//           messages: [
//             ...conversation.messages,
//             userMessage,
//           ],
//         };
//       })
//     );

//     setLoading(true);

//     try {
//       /*
//        * Send message to Gemini
//        */
//       const response = await fetch("/api/chat", {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           message,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.error ||
//             "Something went wrong"
//         );
//       }

//       /*
//        * AI Message
//        */
//       const assistantMessage: Message = {
//         id: Date.now() + 1,
//         role: "assistant",
//         content: data.reply,
//       };

//       setConversations((prev) =>
//         prev.map((conversation) => {
//           if (
//             conversation.id !==
//             conversationId
//           ) {
//             return conversation;
//           }

//           return {
//             ...conversation,
//             messages: [
//               ...conversation.messages,
//               assistantMessage,
//             ],
//           };
//         })
//       );
//     } catch (error) {
//       console.error(
//         "CHAT ERROR:",
//         error
//       );

//       const errorMessage: Message = {
//         id: Date.now() + 1,
//         role: "assistant",
//         content:
//           error instanceof Error
//             ? error.message
//             : "Something went wrong.",
//       };

//       setConversations((prev) =>
//         prev.map((conversation) => {
//           if (
//             conversation.id !==
//             conversationId
//           ) {
//             return conversation;
//           }

//           return {
//             ...conversation,
//             messages: [
//               ...conversation.messages,
//               errorMessage,
//             ],
//           };
//         })
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-zinc-100">
//       {/* Sidebar */}
//       <Sidebar
//         conversations={conversations}
//         activeConversationId={
//           activeConversationId
//         }
//         onNewChat={handleNewChat}
//         onSelectChat={handleSelectChat}
//       />

//       {/* Main Chat */}
//       <div className="flex min-w-0 flex-1 flex-col">
//         {/* Header */}
//         <header className="border-b bg-white px-6 py-4">
//           <h1 className="text-xl font-bold text-zinc-900">
//             Amit Mahmud Amil's Ai
//           </h1>

//           <p className="text-sm text-zinc-500">
//             Your personal AI assistant
//           </p>
//         </header>

//         {/* Messages */}
//         <MessageList
//           messages={messages}
//           loading={loading}
//         />

//         {/* Input */}
//         <ChatInput
//           onSend={sendMessage}
//           loading={loading}
//         />
//       </div>
//     </div>
//   );
// }












// "use client";

// import { useState } from "react";
// import ChatInput from "./ChatInput";
// import MessageList from "./MessageList";
// import Sidebar from "../sideber/Sideber";
// import type {
//   Conversation,
//   Message,
// } from "@/app/lib/types/chat";

// export default function ChatContainer() {
//   const [conversations, setConversations] =
//     useState<Conversation[]>([]);

//   const [activeConversationId, setActiveConversationId] =
//     useState<string | null>(null);

//   const [loading, setLoading] = useState(false);

//   /*
//    * Active conversation
//    */
//   const activeConversation =
//     conversations.find(
//       (conversation) =>
//         conversation.id === activeConversationId
//     );

//   const messages: Message[] =
//     activeConversation?.messages || [];

//   /*
//    * New Chat
//    */
//   const handleNewChat = () => {
//     const newConversation: Conversation = {
//       id: Date.now(),
//       title: "New Chat",
//       messages: [],
//     };

//     setConversations((prev) => [
//       newConversation,
//       ...prev,
//     ]);

//     setActiveConversationId(newConversation.id);
//   };

//   /*
//    * Select Chat
//    */
//   const handleSelectChat = (id: number) => {
//     setActiveConversationId(id);
//   };

//   /*
//    * Send Message
//    */
//  const sendMessage = async (message: string) => {
//   if (!message.trim() || loading) return;

//   setLoading(true);

//   try {
//     const response = await fetch("/api/chat", {
//       method: "POST",

//       headers: {
//         "Content-Type": "application/json",
//       },

//       body: JSON.stringify({
//         message,

//         conversationId:
//           activeConversationId,
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         data.error || "Something went wrong"
//       );
//     }

//     /*
//      * If this was a new conversation,
//      * API gives us the MongoDB ID.
//      */
//     const conversationId =
//       data.conversationId;

//     /*
//      * Add conversation if it didn't exist
//      */
//     setConversations((prev) => {
//       const exists = prev.some(
//         (conversation) =>
//           conversation.id === conversationId
//       );

//       if (exists) {
//         return prev;
//       }

//       return [
//         {
//           id: conversationId,
//           title: message.slice(0, 40),
//           messages: [],
//         },
//         ...prev,
//       ];
//     });

//     /*
//      * Set active conversation
//      */
//     setActiveConversationId(
//       conversationId
//     );

//     /*
//      * Add messages to frontend
//      */
//     setConversations((prev) =>
//       prev.map((conversation) => {
//         if (
//           conversation.id !==
//           conversationId
//         ) {
//           return conversation;
//         }

//         return {
//           ...conversation,

//           title:
//             conversation.messages.length === 0
//               ? message.slice(0, 40)
//               : conversation.title,

//           messages: [
//             ...conversation.messages,

//             {
//               id: Date.now(),
//               role: "user",
//               content: message,
//             },

//             {
//               id: Date.now() + 1,
//               role: "assistant",
//               content: data.reply,
//             },
//           ],
//         };
//       })
//     );
//   } catch (error) {
//     console.error(
//       "SEND MESSAGE ERROR:",
//       error
//     );
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="flex h-screen overflow-hidden bg-zinc-100">
//       {/* Sidebar */}
//       <Sidebar
//         conversations={conversations}
//         activeConversationId={
//           activeConversationId
//         }
//         onNewChat={handleNewChat}
//         onSelectChat={handleSelectChat}
//       />

//       {/* Main Chat */}
//       <div className="flex min-w-0 flex-1 flex-col">
//         {/* Header */}
//         <header className="border-b bg-white px-6 py-4">
//           <h1 className="text-xl font-bold text-zinc-900">
//             Amit Mahmud Amil's Ai
//           </h1>

//           <p className="text-sm text-zinc-500">
//             Your personal AI assistant
//           </p>
//         </header>

//         {/* Messages */}
//         <MessageList
//           messages={messages}
//           loading={loading}
//         />

//         {/* Input */}
//         <ChatInput
//           onSend={sendMessage}
//           loading={loading}
//         />
//       </div>
//     </div>
//   );
// }















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

  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [loadingChats, setLoadingChats] =
    useState(true);

  /*
   * ==============================
   * LOAD CHATS FROM MONGODB
   * ==============================
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

        const data = await response.json();

        console.log(
          "CHATS FROM API:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load conversations"
          );
        }

        setConversations(data);

        /*
         * Select first chat automatically
         */
        if (
          data.length > 0
        ) {
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
   * ==============================
   * ACTIVE CHAT
   * ==============================
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
   * ==============================
   * NEW CHAT
   * ==============================
   */
  const handleNewChat = () => {
    setActiveConversationId(null);
  };

  /*
   * ==============================
   * SELECT CHAT
   * ==============================
   */
  const handleSelectChat = (
    id: string
  ) => {
    setActiveConversationId(id);
  };

  /*
   * ==============================
   * SEND MESSAGE
   * ==============================
   */
  const sendMessage = async (
    message: string
  ) => {
    if (
      !message.trim() ||
      loading
    ) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message,

            conversationId:
              activeConversationId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Something went wrong"
        );
      }

      const conversationId =
        data.conversationId;

      const userMessage: Message = {
        id: Date.now(),

        role: "user",

        content: message,
      };

      const assistantMessage: Message = {
        id: Date.now() + 1,

        role: "assistant",

        content: data.reply,
      };

      /*
       * New conversation
       */
      if (
        !activeConversationId
      ) {
        const newConversation: Conversation =
          {
            id: conversationId,

            title:
              message.slice(0, 40),

            messages: [
              userMessage,
              assistantMessage,
            ],
          };

        setConversations((prev) => [
          newConversation,
          ...prev,
        ]);
      } else {
        /*
         * Existing conversation
         */
        setConversations((prev) =>
          prev.map((conversation) => {
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
          })
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

  /*
   * ==============================
   * LOADING
   * ==============================
   */
  if (loadingChats) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900" />

          <p className="text-sm text-zinc-500">
            Loading chats...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ==============================
   * UI
   * ==============================
   */
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100">
      {/* Sidebar */}

      <Sidebar
        conversations={conversations}
        activeConversationId={
          activeConversationId
        }
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      {/* Main */}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}

        <header className="border-b bg-white px-6 py-4">
          <h1 className="text-xl font-bold text-zinc-900">
            Amit Mahmud Amil&apos;s AI
          </h1>

          <p className="text-sm text-zinc-500">
            Your personal AI assistant
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
    </div>
  );
}