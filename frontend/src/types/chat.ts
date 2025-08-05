// types/chat.ts

export interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  type: "text" | "file";
  avatar?: string;
}

export interface Conversation {
  id: number;
  name: string;
  type: "group" | "direct";
  lastMessage: string;
  lastTime: string;
  unread: number;
  avatar?: string;
  online?: boolean;
  pinned?: boolean;
}
