export interface KafkaMessage<T = unknown> {
  key?: string;
  value: T;
  headers?: Record<string, string>;
  timestamp?: string;
}

export interface KafkaProducerRecord<T = unknown> {
  topic: string;
  messages: KafkaMessage<T>[];
}

export interface KafkaConsumerConfig {
  topic: string | string[];
  fromBeginning?: boolean;
}

export interface KafkaEventPayload<T = unknown> {
  eventId: string;
  eventType: string;
  timestamp: string;
  data: T;
  metadata?: Record<string, unknown>;
}
