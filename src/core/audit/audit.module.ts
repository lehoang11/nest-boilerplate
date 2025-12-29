// src/core/audit/audit.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditService } from './audit.service';
import { AuditInterceptor } from './audit.interceptor';
import { AuditConsumer } from './audit.consumer';
import { AuditRepository } from './audit.repository';

@Module({
  imports: [ConfigModule],
  providers: [
    AuditService,
    AuditConsumer,
    AuditRepository,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
  exports: [AuditService],
})
export class AuditModule {}
