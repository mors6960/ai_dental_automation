import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AutomationMetricsService {
  private readonly logger = new Logger(AutomationMetricsService.name);
  private readonly counters = new Map<string, number>();

  increment(metric: string) {
    const next = (this.counters.get(metric) ?? 0) + 1;
    this.counters.set(metric, next);
    this.logger.debug(`metric=${metric} count=${next}`);
  }

  observeLatency(metric: string, startedAtMs: number) {
    const latencyMs = Date.now() - startedAtMs;
    this.logger.debug(`metric=${metric} latencyMs=${latencyMs}`);
  }
}
