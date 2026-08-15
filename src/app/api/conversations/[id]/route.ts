import { NextResponse } from "next/server";

import connectDB from "@/app/lib/mongodb";
import Conversation from "@/models/Conversation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/*
 * ==============================
 * RENAME CHAT
 * PATCH /api/conversations/:id
 * ==============================
 */
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await request.json();

    const title = body.title?.trim();

    if (!title) {
      return NextResponse.json(
        {
          error: "Chat title is required",
        },
        {
          status: 400,
        }
      );
    }

    const conversation =
      await Conversation.findByIdAndUpdate(
        id,
        {
          title: title.slice(0, 100),
        },
        {
          new: true,
        }
      );

    if (!conversation) {
      return NextResponse.json(
        {
          error: "Conversation not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      id: conversation._id.toString(),
      title: conversation.title,
    });
  } catch (error) {
    console.error(
      "RENAME CHAT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to rename chat",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * ==============================
 * DELETE CHAT
 * DELETE /api/conversations/:id
 * ==============================
 */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const conversation =
      await Conversation.findByIdAndDelete(
        id
      );

    if (!conversation) {
      return NextResponse.json(
        {
          error: "Conversation not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Chat deleted successfully",
      conversationId: id,
    });
  } catch (error) {
    console.error(
      "DELETE CHAT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete chat",
      },
      {
        status: 500,
      }
    );
  }
}