// src/core/audit/audit.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { KafkaService, KAFKA_TOPICS } from '../kafka';
import { AuditEvent } from './audit.event';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly kafkaService: KafkaService) {}

  async publish(event: AuditEvent): Promise<void> {
    try {
      await this.kafkaService.emit(
        KAFKA_TOPICS.AUDIT_LOG,
        'audit.event',
        event,
      );
    } catch (error) {
      // ❗ Audit không được làm crash request
      this.logger.error('Failed to publish audit event', error);
    }
  }
}
