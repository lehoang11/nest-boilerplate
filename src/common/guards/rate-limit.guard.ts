// import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common'
// import { RedisService } from '../redis/redis.service'

// export const RateLimit = (windowSec: number, max: number) => SetMetadata('rate_limit', { windowSec, max })

// @Injectable()
// export class RateLimitGuard implements CanActivate {
//   constructor(private readonly redis: RedisService) {}
//   async canActivate(ctx: ExecutionContext): Promise<boolean> {
//     const req = ctx.switchToHttp().getRequest()
//     const handler = ctx.getHandler()
//     const meta = Reflect.getMetadata('rate_limit', handler) || { windowSec: Number(process.env.RATE_WINDOW_SEC || 60), max: Number(process.env.RATE_MAX || 10) }
//     const id = (req.user?.id as string) || (req.ip as string)
//     const key = `rl:${req.route.path}:${id}`
//     const client = this.redis.get()
//     const n = await client.incr(key)
//     if (n === 1) await client.expire(key, meta.windowSec)
//     return n <= meta.max
//   }
// }
