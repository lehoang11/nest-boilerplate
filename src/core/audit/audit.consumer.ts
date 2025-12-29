// src/core/audit/audit.consumer.ts

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaService, KAFKA_TOPICS } from '../kafka';
import { KafkaConfig } from '../../config';
import { AuditEvent } from './audit.event';
import { AuditRepository } from './audit.repository';

@Injectable()
export class AuditConsumer implements OnModuleInit {
  private readonly logger = new Logger(AuditConsumer.name);

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly configService: ConfigService,
    private readonly auditRepository: AuditRepository,
  ) {}

  async onModuleInit() {
    const kafkaConfig = this.configService.get<KafkaConfig>('kafka');

    if (!kafkaConfig?.enabled) {
      this.logger.log('Kafka is disabled, skipping audit consumer subscription');
      return;
    }

    await this.kafkaService.subscribe(
      KAFKA_TOPICS.AUDIT_LOG,
      async (payload: unknown) => {
        const event = (payload as { data: AuditEvent }).data;
        await this.auditRepository.save(event);
        this.logger.debug(`Processed audit event: ${event.action}`);
      },
    );

    this.logger.log(`Subscribed to ${KAFKA_TOPICS.AUDIT_LOG}`);
  }
}
