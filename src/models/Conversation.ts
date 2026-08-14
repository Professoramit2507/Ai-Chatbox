import mongoose, {
  Schema,
  models,
  model,
} from "mongoose";

const MessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
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