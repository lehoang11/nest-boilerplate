import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { INTERNAL_AUTH_KEY } from '../decorators/internal-auth.decorator'
import * as crypto from 'crypto'

@Injectable()
export class InternalServiceAuthGuard implements CanActivate {
  private readonly allowedServices: Map<string, string> = new Map()
  private readonly whitelistedIPs: string[] = []

  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {
    // Initialize allowed services from environment
    this.initializeServices()
    this.initializeWhitelist()
  }

  private initializeServices() {
    // Add admin-service
    const adminServiceSecret = this.configService.get<string>('BACKEND_CORE_SECRET')
    if (adminServiceSecret) {
      this.allowedServices.set('admin-service', adminServiceSecret)
    }

    // Add other services as needed
    const launchpadServiceSecret = this.configService.get<string>('LAUNCHPAD_SERVICE_SECRET')
    if (launchpadServiceSecret) {
      this.allowedServices.set('launchpad-service', launchpadServiceSecret)
    }
  }

  private initializeWhitelist() {
    const whitelist = this.configService.get<string>('INTERNAL_SERVICE_WHITELIST')
    if (whitelist) {
      this.whitelistedIPs.push(...whitelist.split(',').map(ip => ip.trim()))
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()

    // Check if the endpoint requires internal authentication
    const isInternalAuth = this.reflector.get<boolean>(INTERNAL_AUTH_KEY, context.getHandler())
    const isControllerLevelAuth = this.reflector.get<boolean>(INTERNAL_AUTH_KEY, context.getClass())
    
    if (!isInternalAuth && !isControllerLevelAuth) {
      // If no InternalAuth decorator is present, allow access
      return true
    }

    try {
      // Check required headers
      const serviceName = request.headers['x-service-name'] as string
      const serviceSecret = request.headers['x-service-secret'] as string
      const timestamp = request.headers['x-timestamp'] as string
      const signature = request.headers['x-signature'] as string

      // console.log(serviceName);
      // console.log(serviceSecret);
      // console.log(timestamp);
      // console.log(signature);

      // Validate required headers exist
      if (!serviceName || !serviceSecret || !timestamp || !signature) {
        throw new ForbiddenException('Missing required internal service headers')
      }

      // Check if service name is valid
      if (!this.allowedServices.has(serviceName)) {
        throw new ForbiddenException('Invalid service name')
      }

      // Check if secret key is correct
      const expectedSecret = this.allowedServices.get(serviceName)
      if (serviceSecret !== expectedSecret) {
        throw new ForbiddenException('Invalid service secret')
      }

      // Check timestamp (prevent replay attacks - should be within last 5 minutes)
      const requestTime = parseInt(timestamp)
      const now = Date.now()
      const timeDiff = now - requestTime
      
      if (isNaN(requestTime) || timeDiff > 300000 || timeDiff < -300000) {
        throw new ForbiddenException('Invalid or expired timestamp')
      }

      // Check IP whitelist (if configured)
      if (this.whitelistedIPs.length > 0) {
        const clientIP = this.getClientIP(request)
        if (!this.whitelistedIPs.includes(clientIP)) {
          throw new ForbiddenException('IP not whitelisted')
        }
      }

      // Verify signature for additional security
      const payload = this.buildPayload(request, timestamp)
      const expectedSignature = this.generateSignature(payload, expectedSecret)
      
      if (signature !== expectedSignature) {
        throw new ForbiddenException('Invalid signature')
      }

      // Add service info to request for downstream use
      request.internalService = {
        name: serviceName,
        authenticated: true,
        timestamp: requestTime
      }

      return true
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error
      }
      throw new ForbiddenException('Internal service authentication failed')
    }
  }

  private getClientIP(request: any): string {
    return request.ip || 
           request.connection.remoteAddress || 
           request.socket.remoteAddress ||
           (request.connection.socket ? request.connection.socket.remoteAddress : null) ||
           '127.0.0.1'
  }

  private buildPayload(request: any, timestamp: string): string {
    const method = request.method
    const url = request.originalUrl || request.url
    const body = typeof request.body === 'string' ? request.body : JSON.stringify(request.body || {})
    
    return `${method}\n${url}\n${timestamp}\n${body}`
  }

  private generateSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex')
  }
}