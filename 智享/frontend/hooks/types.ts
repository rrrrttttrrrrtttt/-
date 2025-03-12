export interface Message {
  content: string;
  senderId: number;
  receiverId: number;
  timestamp?: Date;
}