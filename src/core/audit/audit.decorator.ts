// src/core/audit/audit.decorator.ts

import { SetMetadata } from '@nestjs/common';
import { AuditAction } from './audit.event';

export const AUDIT_KEY = 'audit_action';

export const Audit = (action: AuditAction) =>
  SetMetadata(AUDIT_KEY, action);
