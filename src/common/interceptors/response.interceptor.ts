import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { SKIP_WRAP_KEY } from '../decorators/skip-wrap.decorator';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const skipWrap = this.reflector.getAllAndOverride<boolean>(
      SKIP_WRAP_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipWrap) {
      return next.handle();
    }

    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data ?? null,
        error: null,
        traceId: req.id,
      })),
    );
  }
}




// Cách sử dụng @SkipWrap
// 🟢 Skip cho 1 endpoint
// @Post('webhook/payment')
// @SkipWrap()
// handleWebhook(@Body() payload: any) {
//   return { received: true };
// }


// ➡️ Response raw, không bị wrap.

// 🟡 Skip cho cả controller
// @SkipWrap()
// @Controller('files')
// export class FilesController {
//   @Get(':id')
//   download() {
//     // stream file
//   }
// }

// 4️⃣ File download (case thực tế)
// @Get(':id')
// @SkipWrap()
// download(@Res() res: Response) {
//   res.download('/path/to/file.pdf');
// }