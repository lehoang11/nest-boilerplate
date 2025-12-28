import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { InternalAuthService } from './internal-auth.service'
import { firstValueFrom } from 'rxjs'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

@Injectable()
export class UCenterService {
  private readonly baseUrl: string

  constructor(
    private readonly httpService: HttpService,
    private readonly internalAuthService: InternalAuthService,
  ) {
    this.baseUrl = this.internalAuthService.getUcenterUrl()
  }

  /**
   * Make authenticated GET request to ucenter
   */
  async get<T = any>(endpoint: string, params?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config = this.createRequestConfig('GET', endpoint, null, params)
    
    try {
      const response = await firstValueFrom(this.httpService.get(url, config))
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Make authenticated POST request to backend-core
   */
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config = this.createRequestConfig('POST', endpoint, data)
    
    try {
      const response = await firstValueFrom(this.httpService.post(url, data, config))
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Make authenticated PUT request to backend-core
   */
  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config = this.createRequestConfig('PUT', endpoint, data)
    
    try {
      const response = await firstValueFrom(this.httpService.put(url, data, config))
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Make authenticated PATCH request to backend-core
   */
  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config = this.createRequestConfig('PATCH', endpoint, data)
    
    try {
      const response = await firstValueFrom(this.httpService.patch(url, data, config))
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Make authenticated DELETE request to backend-core
   */
  async delete<T = any>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const config = this.createRequestConfig('DELETE', endpoint)
    
    try {
      const response = await firstValueFrom(this.httpService.delete(url, config))
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Create request configuration with internal auth headers
   */
  private createRequestConfig(
    method: string,
    endpoint: string,
    data?: any,
    params?: any,
  ): AxiosRequestConfig {
    const authHeaders = this.internalAuthService.generateAuthHeaders(method, endpoint, data)
    
    return {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      params,
      timeout: this.internalAuthService.getUcenterTimeout(),
    }
  }

  /**
   * Handle and rethrow errors appropriately
   */
  private handleError(error: any): never {
    if (error.response) {
      // Backend-core responded with error status
      const status = error.response.status
      const message = error.response.data?.message || error.message
      
      switch (status) {
        case 401:
          throw new Error('UCenterService authentication failed')
        case 403:
          throw new Error('UCenterService access forbidden')
        case 404:
          throw new Error('UCenterService endpoint not found')
        case 408:
          throw new Error('UCenterService request timeout')
        default:
          throw new Error(`UCenterService error (${status}): ${message}`)
      }
    } else if (error.request) {
      // Network error
      throw new Error('UCenterService service unavailable')
    } else {
      // Other error
      throw new Error(`UCenterService request failed: ${error.message}`)
    }
  }
}
