// src/core/audit/audit.event.ts

export enum AuditAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  ORDER_CREATE = 'ORDER_CREATE',
  ORDER_CANCEL = 'ORDER_CANCEL',
  WITHDRAW = 'WITHDRAW',
  DEPOSIT = 'DEPOSIT',
  ENABLE_2FA = 'ENABLE_2FA',
  DISABLE_2FA = 'DISABLE_2FA',
  ADMIN_ACTION = 'ADMIN_ACTION',
}

export interface AuditEvent {
  userId?: string;
  action: AuditAction;
  resource: string;              // order, user, wallet
  resourceId?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}
