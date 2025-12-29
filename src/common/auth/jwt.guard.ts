import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const auth = req.headers['authorization'] || req.headers['Authorization']
    if (!auth || typeof auth !== 'string') throw new UnauthorizedException()
    const parts = auth.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') throw new UnauthorizedException()
    try {
      const payload = await this.jwt.verifyAsync(parts[1])
      if (payload?.type !== 'access') throw new UnauthorizedException()
      req.user = payload
      return true
    } catch {
      throw new UnauthorizedException()
    }
  }
}
