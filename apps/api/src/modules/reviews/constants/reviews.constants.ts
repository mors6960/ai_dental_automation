export const REVIEWS_MODULE = {
  controller: "reviews",
} as const;

export enum ReviewRequestStatus {
  QUEUED = "QUEUED",
  SENT = "SENT",
  OPENED = "OPENED",
  RESPONDED = "RESPONDED",
  FAILED = "FAILED",
}
