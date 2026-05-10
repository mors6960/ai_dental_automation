export const CHATBOT_MODULE = {
  controller: "chatbot",
} as const;

export enum ChatbotSessionStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}
