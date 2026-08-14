// import { NextResponse } from "next/server";
// import gemini from "@/app/lib/gemini";

// export async function POST(request) {
//   try {
//     const body = await request.json();

//     const message = body.message;

//     if (!message || typeof message !== "string") {
//       return NextResponse.json(
//         {
//           error: "Message is required",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     const interaction = await gemini.interactions.create({
//       model: "gemini-3.6-flash",

//       input: message,

//       system_instruction: `
// You are an AI assistant named "Nova".

// Never say that you are Gemini.
// Never introduce yourself as Google Gemini.

// If the user asks your name, say:
// "I'm Nova, your AI assistant."

// Be friendly, helpful, and concise.
//       `,
//     });

//     return NextResponse.json({
//       reply:
//         interaction.output_text ||
//         "Sorry, I couldn't generate a response.",
//     });
//   } catch (error) {
//     console.error("GEMINI ERROR:", error);

//     return NextResponse.json(
//       {
//         error:
//           error instanceof Error
//             ? error.message
//             : "Gemini API failed",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }









import { NextResponse } from "next/server";
import mongoose from "mongoose";

import gemini from "@/app/lib/gemini";
import connectDB from "@/app/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function POST(request) {
  try {
    const body = await request.json();

    const message = body.message;
    const conversationId = body.conversationId;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    // Connect MongoDB
    await connectDB();

    /*
     * Find existing conversation
     */
    let conversation;

    if (conversationId) {
      if (
        !mongoose.Types.ObjectId.isValid(
          conversationId
        )
      ) {
        return NextResponse.json(
          {
            error: "Invalid conversation ID",
          },
          {
            status: 400,
          }
        );
      }

      conversation =
        await Conversation.findById(
          conversationId
        );

      if (!conversation) {
        return NextResponse.json(
          {
            error:
              "Conversation not found",
          },
          {
            status: 404,
          }
        );
      }
    }

    /*
     * If no conversation exists,
     * create a new one
     */
    if (!conversation) {
      conversation =
        await Conversation.create({
          title: message.slice(0, 40),
          messages: [],
        });
    }

    /*
     * Save user message
     */
    conversation.messages.push({
      role: "user",
      content: message,
    });

    await conversation.save();

    /*
     * Send message to Gemini
     *
     * If previous interaction exists,
     * continue the Gemini conversation.
     */
    const interaction =
      await gemini.interactions.create({
        model: "gemini-3.6-flash",

        input: message,

        ...(conversation.geminiInteractionId
          ? {
              previous_interaction_id:
                conversation.geminiInteractionId,
            }
          : {}),

        system_instruction: `
You are an AI assistant named "Nova".

Never say that you are Gemini.
Never introduce yourself as Google Gemini.

If the user asks your name, say:
"I'm Nova, your AI assistant."

Be friendly, helpful, and concise.
        `,
      });

    const reply =
      interaction.output_text ||
      "Sorry, I couldn't generate a response.";

    /*
     * Save Gemini interaction ID
     */
    conversation.geminiInteractionId =
      interaction.id;

    /*
     * Save AI response
     */
    conversation.messages.push({
      role: "assistant",
      content: reply,
    });

    await conversation.save();

    /*
     * Return everything to frontend
     */
    return NextResponse.json({
      conversationId:
        conversation._id.toString(),

      reply,

      interactionId:
        interaction.id,
    });
  } catch (error) {
    console.error(
      "CHAT API ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}