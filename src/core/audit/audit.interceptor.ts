// src/core/audit/audit.interceptor.ts

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';
import { AuditAction, AuditEvent } from './audit.event';

export const AUDIT_KEY = 'audit_action';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly auditService: AuditService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const auditAction = this.reflector.get<AuditAction>(
      AUDIT_KEY,
      context.getHandler(),
    );

    if (!auditAction) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        const event: AuditEvent = {
          userId: req.user?.id,
          action: auditAction,
          resource: req.route?.path ?? 'unknown',
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          metadata: {
            method: req.method,
          },
          createdAt: new Date().toISOString(),
        };

        this.auditService.publish(event);
      }),
    );
  }
}
