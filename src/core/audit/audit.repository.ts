// src/core/audit/audit.repository.ts

import { Injectable } from '@nestjs/common';
import { AuditEvent } from './audit.event';

@Injectable()
export class AuditRepository {
  async save(event: AuditEvent): Promise<void> {
    // insert into audit_logs (append-only)
  }
}
