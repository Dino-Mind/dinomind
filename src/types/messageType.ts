export interface Message {
  sender: Sender;
  text: string;
}

export enum Sender {
  SYSTEM = "system",
  AI = "ai",
  USER = "user",
}
