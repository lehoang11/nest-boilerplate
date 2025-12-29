import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_ERROR';
    let message = 'Internal server error';
    let details = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;

      message = response.message || exception.message;

      if (typeof response === 'object') {
        errorCode = response.code || exception.name;
        details = response.details ?? null;
      }
    }

    res.status(status).json({
      success: false,
      data: null,
      error: {
        code: errorCode,
        message,
        details,
      },
      traceId: req.id,
    });
  }
}
