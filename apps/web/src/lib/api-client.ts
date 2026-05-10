export interface ApiErrorPayload {
  code: string | null;
  details?: unknown;
}

interface ApiEnvelope<T> {
  success: boolean;
  error: ApiErrorPayload | null;
  message: string;
  timestamp: string;
  apiResponseTimeMs: number;
  data: T | null;
}

export class ApiClientError extends Error {
  status: number;
  code: string | null;
  details?: unknown;

  constructor(params: {
    message: string;
    status: number;
    code?: string | null;
    details?: unknown;
  }) {
    super(params.message);
    this.name = "ApiClientError";
    this.status = params.status;
    this.code = params.code ?? null;
    this.details = params.details;
  }
}

export interface ApiResult<T> {
  data: T;
  message: string;
  timestamp: string;
  apiResponseTimeMs: number;
}

function getBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.hostname}:3022`;
  }

  return "http://localhost:3022";
}

function normalizeHeaders(headers?: HeadersInit) {
  return {
    "content-type": "application/json",
    ...(headers ?? {}),
  };
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...init,
    headers: normalizeHeaders(init?.headers),
  });

  let payload: ApiEnvelope<T> | null = null;

  try {
    payload = (await response.json()) as ApiEnvelope<T>;
  } catch {
    throw new ApiClientError({
      message: "Unable to read server response.",
      status: response.status,
    });
  }

  if (!response.ok || !payload.success || payload.data === null) {
    throw new ApiClientError({
      message: payload.message || "Request failed.",
      status: response.status,
      code: payload.error?.code,
      details: payload.error?.details,
    });
  }

  return {
    data: payload.data,
    message: payload.message,
    timestamp: payload.timestamp,
    apiResponseTimeMs: payload.apiResponseTimeMs,
  };
}
