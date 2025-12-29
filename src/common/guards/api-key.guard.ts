import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ApiKeyService } from '../../modules/api-key/api-key.service'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly svc: ApiKeyService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest()
    const keyId = req.headers['x-api-key'] as string
    const sign = req.headers['x-signature'] as string
    const ts = req.headers['x-timestamp'] as string
    if (!keyId || !sign || !ts) return false
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})
    const payload = `${req.method}\n${req.originalUrl}\n${ts}\n${body}`
    return this.svc.verifySignature(keyId, sign, payload)
  }
}
