
export type MessageRole =
  | "user"
  | "assistant";

export type Message = {
  id: string | number;
  role: MessageRole;
  content: string;

  fileName?: string;
  fileType?: string;
  fileUrl?: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
};