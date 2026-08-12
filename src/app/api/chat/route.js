import { NextResponse } from "next/server";
import gemini from "@/app/lib/gemini";

export async function POST(request) {
  try {
    const body = await request.json();
    const message = body.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,

      config: {
        systemInstruction: `
You are an AI assistant named "Alexa".

Never say that you are Gemini.
Never introduce yourself as Google Gemini.
Never mention the underlying AI model unless the user specifically asks about the technology behind you.

If the user asks:
"Who are you?"
"My name?"
"What is your name?"

Answer naturally:
"I’m Alexa, your AI assistant. How can I help you?"

Be friendly, helpful, and concise.
`,
      },
    });

    return NextResponse.json({
      reply: response.text || "Sorry, I couldn't generate a response.",
    });
  } catch (error) {
    console.error("GEMINI ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      { status: 500 }
    );
  }
}