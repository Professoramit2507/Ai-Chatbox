// import { NextResponse } from "next/server";
// import connectDB from "@/app/lib/mongodb";
// import Conversation from "@/models/Conversation";

// export async function GET() {
//   try {
//     await connectDB();

//     const conversations = await Conversation.find()
//       .sort({ updatedAt: -1 })
//       .lean();

//     return NextResponse.json(conversations);
//   } catch (error) {
//     console.error("MONGODB ERROR:", error);

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "Unknown MongoDB error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }



import { NextResponse } from "next/server";

import connectDB from "@/app/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function GET() {
  try {
    await connectDB();

    const conversations =
      await Conversation.find({})
        .sort({ updatedAt: -1 })
        .lean();

    const formattedConversations =
      conversations.map((conversation) => ({
        id: conversation._id.toString(),

        title:
          conversation.title || "New Chat",

        messages: (
          conversation.messages || []
        ).map((message, index) => ({
          id: index + 1,

          role: message.role,

          content: message.content,
        })),
      }));

    console.log(
      "CONVERSATIONS FROM MONGODB:",
      formattedConversations
    );

    return NextResponse.json(
      formattedConversations
    );
  } catch (error) {
    console.error(
      "GET CONVERSATIONS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load conversations",
      },
      {
        status: 500,
      }
    );
  }
}