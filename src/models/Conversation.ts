import mongoose, {
  Schema,
  model,
  models,
} from "mongoose";

const MessageSchema =
  new Schema(
    {
      role: {
        type: String,
        enum: [
          "user",
          "assistant",
        ],
        required: true,
      },

      content: {
        type: String,
        required: true,
      },

      fileName: {
        type: String,
        default: null,
      },

      fileType: {
        type: String,
        default: null,
      },
    },
    {
      _id: true,
    }
  );

const ConversationSchema =
  new Schema(
    {
      title: {
        type: String,
        default: "New Chat",
      },

      messages: {
        type: [MessageSchema],
        default: [],
      },

      geminiInteractionId: {
        type: String,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

const Conversation =
  models.Conversation ||
  model(
    "Conversation",
    ConversationSchema
  );

export default Conversation;