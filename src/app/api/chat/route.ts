import { NextResponse } from "next/server";

import gemini from "@/app/lib/gemini";
import connectDB from "@/app/lib/mongodb";
import Conversation from "@/models/Conversation";

export async function POST(
  request
) {
  try {
    /*
     * =====================================
     * READ FORMDATA
     * =====================================
     */

    const formData =
      await request.formData();

    const message =
      formData.get("message") as
        | string
        | null;

    const conversationId =
      formData.get(
        "conversationId"
      ) as string | null;

    const file =
      formData.get("file") as
        | File
        | null;

    /*
     * =====================================
     * VALIDATION
     * =====================================
     */

    if (
      !message?.trim() &&
      !file
    ) {
      return NextResponse.json(
        {
          error:
            "Message or file is required",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * =====================================
     * DATABASE
     * =====================================
     */

    await connectDB();

    let conversation = null;

    if (conversationId) {
      conversation =
        await Conversation.findById(
          conversationId
        );
    }

    /*
     * Create new conversation
     */

    if (!conversation) {
      conversation =
        await Conversation.create({
          title:
            message?.slice(0, 40) ||
            file?.name ||
            "New Chat",

          messages: [],
        });
    }

    /*
     * =====================================
     * GEMINI CONTENT
     * =====================================
     */

    const parts: any[] = [];

    /*
     * Text
     */

    if (message?.trim()) {
      parts.push({
        text: message,
      });
    }

    /*
     * =====================================
     * FILE
     * =====================================
     */

    if (file) {
      const arrayBuffer =
        await file.arrayBuffer();

      const buffer =
        Buffer.from(arrayBuffer);

      const base64 =
        buffer.toString("base64");

      parts.push({
        inlineData: {
          mimeType:
            file.type ||
            "application/octet-stream",

          data: base64,
        },
      });
    }

    /*
     * If user only uploads file
     */

    if (
      !message?.trim() &&
      file
    ) {
      parts.unshift({
        text: `
Analyze the uploaded file carefully.

If it is an image, describe and analyze
the image.

If it is a PDF, explain the important
information inside it.

If it is a text or CSV file, analyze
its contents.

Give a clear and helpful answer.
        `,
      });
    }

    /*
     * =====================================
     * GEMINI
     * =====================================
     */

    const result =
      await gemini.models.generateContent(
        {
          model: "gemini-3.1-flash-lite",

          contents: [
            {
              role: "user",

              parts,
            },
          ],

          config: {
            systemInstruction: `
You are an AI assistant named "Amit AI".

Never introduce yourself as Gemini.

If the user asks your name,
say:

"I'm Amit AI, your personal AI assistant."

You can analyze uploaded images,
PDF files, text files and CSV files.

Be helpful, clear and accurate.
            `,
          },
        }
      );

    const reply =
      result.text ||
      "Sorry, I couldn't generate a response.";

    /*
     * =====================================
     * SAVE USER MESSAGE
     * =====================================
     */

    conversation.messages.push({
      role: "user",

      content:
        message ||
        `Uploaded: ${
          file?.name || "file"
        }`,

      fileName:
        file?.name || null,

      fileType:
        file?.type || null,
    });

    /*
     * =====================================
     * SAVE AI MESSAGE
     * =====================================
     */

    conversation.messages.push({
      role: "assistant",

      content: reply,
    });

    /*
     * Update title
     */

    if (
      conversation.messages.length ===
      2
    ) {
      conversation.title =
        message?.slice(0, 40) ||
        file?.name ||
        "New Chat";
    }

    await conversation.save();

    /*
     * =====================================
     * RESPONSE
     * =====================================
     */

    return NextResponse.json({
      conversationId:
        conversation._id.toString(),

      reply,
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