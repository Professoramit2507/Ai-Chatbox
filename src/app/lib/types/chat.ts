export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
};