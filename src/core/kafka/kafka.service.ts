import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaConfig } from '../../config';
import { KafkaMessage, KafkaEventPayload } from './kafka.interfaces';
import { v4 as uuidv4 } from 'uuid';

// Note: You need to install kafkajs: npm install kafkajs
// import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

/**
 * Kafka Service
 * Provides producer/consumer functionality for event-driven messaging
 *
 * Usage:
 * 1. Install kafkajs: npm install kafkajs
 * 2. Uncomment the kafkajs imports and implementation
 * 3. Enable Kafka in .env: KAFKA_ENABLED=true
 */
@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private readonly enabled: boolean;

  // Uncomment when kafkajs is installed:
  // private kafka: Kafka;
  // private producer: Producer;
  // private consumer: Consumer;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<KafkaConfig>('kafka')!;
    this.enabled = config.enabled;
  }

  async onModuleInit() {
    if (!this.enabled) {
      this.logger.log('Kafka is disabled');
      return;
    }

    // Uncomment when kafkajs is installed:
    // await this.initializeKafka();
    this.logger.log('Kafka service initialized (stub mode - install kafkajs)');
  }

  async onModuleDestroy() {
    if (!this.enabled) return;

    // Uncomment when kafkajs is installed:
    // await this.disconnect();
  }

  // ============================================
  // Initialization (uncomment when ready)
  // ============================================

  /*
  private async initializeKafka() {
    const config = this.configService.get<KafkaConfig>('kafka')!;

    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      ssl: config.ssl,
      sasl: config.sasl,
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: config.groupId });

    await this.producer.connect();
    this.logger.log('Kafka producer connected');

    await this.consumer.connect();
    this.logger.log('Kafka consumer connected');
  }

  private async disconnect() {
    await this.producer?.disconnect();
    await this.consumer?.disconnect();
    this.logger.log('Kafka connections closed');
  }
  */

  // ============================================
  // Producer Methods
  // ============================================

  /**
   * Send a single message to a topic
   */
  async send<T>(topic: string, message: KafkaMessage<T>): Promise<void> {
    if (!this.enabled) {
      this.logger.debug(`[STUB] Would send to ${topic}:`, message);
      return;
    }

    // Uncomment when kafkajs is installed:
    /*
    await this.producer.send({
      topic,
      messages: [
        {
          key: message.key,
          value: JSON.stringify(message.value),
          headers: message.headers,
        },
      ],
    });
    */

    this.logger.debug(`Sent message to ${topic}`);
  }

  /**
   * Send multiple messages to a topic
   */
  async sendBatch<T>(topic: string, messages: KafkaMessage<T>[]): Promise<void> {
    if (!this.enabled) {
      this.logger.debug(`[STUB] Would send batch to ${topic}:`, messages.length);
      return;
    }

    // Uncomment when kafkajs is installed:
    /*
    await this.producer.send({
      topic,
      messages: messages.map((m) => ({
        key: m.key,
        value: JSON.stringify(m.value),
        headers: m.headers,
      })),
    });
    */

    this.logger.debug(`Sent ${messages.length} messages to ${topic}`);
  }

  /**
   * Emit a standardized event with metadata
   */
  async emit<T>(topic: string, eventType: string, data: T): Promise<void> {
    const payload: KafkaEventPayload<T> = {
      eventId: uuidv4(),
      eventType,
      timestamp: new Date().toISOString(),
      data,
    };

    await this.send(topic, { value: payload });
  }

  // ============================================
  // Consumer Methods
  // ============================================

  /**
   * Subscribe to a topic and process messages
   */
  async subscribe(
    topic: string | string[],
    handler: (payload: unknown, topic: string) => Promise<void>,
    fromBeginning = false,
  ): Promise<void> {
    if (!this.enabled) {
      this.logger.debug(`[STUB] Would subscribe to ${topic}`);
      return;
    }

    // Uncomment when kafkajs is installed:
    /*
    const topics = Array.isArray(topic) ? topic : [topic];

    for (const t of topics) {
      await this.consumer.subscribe({ topic: t, fromBeginning });
    }

    await this.consumer.run({
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        try {
          const value = message.value?.toString();
          if (value) {
            const payload = JSON.parse(value);
            await handler(payload, topic);
          }
        } catch (error) {
          this.logger.error(`Error processing message from ${topic}:`, error);
        }
      },
    });
    */

    this.logger.log(`Subscribed to ${topic}`);
  }

  // ============================================
  // Health Check
  // ============================================

  async isHealthy(): Promise<boolean> {
    if (!this.enabled) return true;

    // Uncomment when kafkajs is installed:
    /*
    try {
      const admin = this.kafka.admin();
      await admin.connect();
      await admin.listTopics();
      await admin.disconnect();
      return true;
    } catch {
      return false;
    }
    */

    return true;
  }
}
