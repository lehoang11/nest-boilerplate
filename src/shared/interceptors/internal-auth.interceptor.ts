import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common'
import { Observable, throwError, TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'
import { InternalAuthService } from '../services/internal-auth.service'
import { HttpService } from '@nestjs/axios'

@Injectable()
export class InternalAuthInterceptor implements NestInterceptor {
  constructor(
    private readonly internalAuthService: InternalAuthService,
    private readonly httpService: HttpService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const backendCoreUrl = this.internalAuthService.getUcenterUrl()

    // Check if this is a request to backend-core service
    if (request.url?.startsWith(backendCoreUrl) || request.headers['x-internal-service-call']) {
      // Add internal auth headers
      const authHeaders = this.internalAuthService.generateAuthHeaders(
        request.method,
        request.originalUrl || request.url,
        request.body,
      )

      // Merge headers
      request.headers = {
        ...request.headers,
        ...authHeaders,
      }

      // Apply timeout
      const timeoutMs = this.internalAuthService.getUcenterTimeout()

      return next.handle().pipe(
        timeout(timeoutMs),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException('UCenter service timeout'))
          }
          return throwError(() => err)
        }),
      )
    }

    return next.handle()
  }
}
