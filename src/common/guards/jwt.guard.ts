import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest()
    const h = req.headers['authorization']
    if (!h || typeof h !== 'string' || !h.startsWith('Bearer ')) return false
    try {
      const token = h.slice(7)
      const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET || 'secret' }) as any
      req.user = { id: payload.sub, email: payload.email }
      return true
    } catch {
      return false
    }
  }
}
