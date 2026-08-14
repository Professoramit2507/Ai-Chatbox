import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/app/lib/mongodb";
import Conversation from "@/models/Conversation";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    await connectDB();

    const { id } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid conversation ID",
        },
        {
          status: 400,
        }
      );
    }

    const conversation =
      await Conversation.findById(id).lean();

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

    return NextResponse.json({
      id: conversation._id.toString(),
      title: conversation.title,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error(
      "GET SINGLE CONVERSATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load conversation",
      },
      {
        status: 500,
      }
    );
  }
}