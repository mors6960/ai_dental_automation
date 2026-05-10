import { Injectable, Logger } from "@nestjs/common";

import { getAppConfig } from "@/config/configuration";
import { AUTOMATION_WORKFLOW_NAMES } from "@/modules/automation/automation.constants";

type N8nWebhookPayload = Record<string, unknown>;
type N8nWebhookResponse =
  | {
      success?: boolean;
      reason?: string;
      workflow?: string;
      raw?: string;
      [key: string]: unknown;
    }
  | string
  | null;

@Injectable()
export class N8nWebhookService {
  private readonly logger = new Logger(N8nWebhookService.name);
  private readonly config = getAppConfig().n8n;

  async triggerLeadFollowup(payload: N8nWebhookPayload) {
    return this.trigger(
      AUTOMATION_WORKFLOW_NAMES.leadFollowup,
      this.config.leadFollowupWebhookPath,
      payload,
    );
  }

  async triggerBookingConfirmation(payload: N8nWebhookPayload) {
    return this.trigger(
      AUTOMATION_WORKFLOW_NAMES.bookingConfirmation,
      this.config.bookingConfirmationWebhookPath,
      payload,
    );
  }

  async triggerReviewRequest(payload: N8nWebhookPayload) {
    return this.trigger(
      AUTOMATION_WORKFLOW_NAMES.reviewRequest,
      this.config.reviewRequestWebhookPath,
      payload,
    );
  }

  private async trigger(workflowName: string, path: string, payload: N8nWebhookPayload) {
    if (!this.isConfigured(path)) {
      this.logger.warn(`Skipping n8n workflow ${workflowName}: n8n config is incomplete.`);
      return null;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const response = await fetch(this.buildUrl(path), {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-workflow-secret": this.config.webhookSecret,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      const data = await this.readResponse(response);

      if (!response.ok) {
        const message = this.getFailureMessage(data, response.statusText);
        throw new Error(
          `n8n workflow ${workflowName} failed with ${response.status}: ${message}. response=${this.stringifyResponse(data)}`,
        );
      }

      if (this.isExplicitFailure(data)) {
        throw new Error(
          `n8n workflow ${workflowName} returned success=false: ${this.getFailureMessage(data, "Unknown n8n workflow failure")}. response=${this.stringifyResponse(data)}`,
        );
      }

      this.logger.log(`Triggered n8n workflow ${workflowName} successfully.`);
      return data;
    } finally {
      clearTimeout(timeout);
    }
  }

  private isConfigured(path: string) {
    return Boolean(this.config.baseUrl && this.config.webhookSecret && path);
  }

  private buildUrl(path: string) {
    const normalizedBase = this.config.baseUrl.replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  private async readResponse(response: Response): Promise<N8nWebhookResponse> {
    const contentType = response.headers.get("content-type") ?? "";

    if (contentType.includes("application/json")) {
      return response.json();
    }

    const text = await response.text();
    return text ? { raw: text } : null;
  }

  private isExplicitFailure(data: N8nWebhookResponse) {
    return Boolean(data && typeof data === "object" && "success" in data && data.success === false);
  }

  private getFailureMessage(data: N8nWebhookResponse, fallback: string) {
    if (data && typeof data === "object" && "reason" in data && typeof data.reason === "string") {
      return data.reason;
    }

    if (data && typeof data === "object" && "raw" in data && typeof data.raw === "string") {
      return data.raw;
    }

    return fallback;
  }

  private stringifyResponse(data: N8nWebhookResponse) {
    if (data == null) {
      return "null";
    }

    if (typeof data === "string") {
      return data;
    }

    try {
      return JSON.stringify(data);
    } catch {
      return "[unserializable response]";
    }
  }
}
