import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'

@Injectable()
export class InternalAuthService {
  private readonly serviceName: string
  private readonly serviceSecret: string

  constructor(private readonly configService: ConfigService) {
    this.serviceName = 'admin-service'
    this.serviceSecret = this.configService.get<string>('UCENTER_INTERNAL_API_KEY') || ''
    
    if (!this.serviceSecret) {
      throw new Error('UCENTER_INTERNAL_API_KEY environment variable is required')
    }
  }

  /**
   * Generate internal authentication headers for calling backend-core service
   */
  generateAuthHeaders(method: string, url: string, body: any = {}): Record<string, string> {
    const timestamp = Date.now().toString()
    const payload = this.buildPayload(method, url, timestamp, body)
    const signature = this.generateSignature(payload)

    return {
      'x-service-name': this.serviceName,
      'x-service-secret': this.serviceSecret,
      'x-timestamp': timestamp,
      'x-signature': signature
    }
  }

  /**
   * Build payload for signature generation
   */
  private buildPayload(method: string, url: string, timestamp: string, body: any): string {
    const bodyStr = typeof body === 'string' ? body : JSON.stringify(body || {})
    return `${method}\n${url}\n${timestamp}\n${bodyStr}`
  }

  /**
   * Generate HMAC SHA256 signature
   */
  private generateSignature(payload: string): string {
    return crypto.createHmac('sha256', this.serviceSecret).update(payload).digest('hex')
  }

  /**
   * Get service name
   */
  getServiceName(): string {
    return this.serviceName
  }

  /**
   * Get ucenter core URL
   */
  getUcenterUrl(): string {
    const url = this.configService.get<string>('UCENTER_INTERNAL_URL')
    if (!url) {
      throw new Error('UCENTER_INTERNAL_URL environment variable is required')
    }
    return url
  }

  /**
   * Get ucenter core timeout
   */
  getUcenterTimeout(): number {
    return this.configService.get<number>('UCENTER_INTERNAL_TIMEOUT', 5000)
  }
}
