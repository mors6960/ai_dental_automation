export interface ApiErrorPayload {
  code: string | null;
  details?: unknown;
}

export interface ApiResponseDto<T> {
  success: boolean;
  error: ApiErrorPayload | null;
  message: string;
  timestamp: string;
  apiResponseTimeMs: number;
  data: T | null;
}
