// types/messageType.ts (define a common type for messages)
export interface Message {
  sender: Sender;
  text: string;
}

export enum Sender {
  SYSTEM = "system",
  AI = "ai",
  USER = "user",
}
