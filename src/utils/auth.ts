import axios, { AxiosInstance } from 'axios'
import { BASE_URL } from './constants'
import {
    UrlCreateRequest,
    UrlResponse,
    UserCreateRequest,
    UserResponse,
} from '../types/authTypes.ts'

export class ApiService {
    private axiosInstance: AxiosInstance

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BASE_URL,
            withCredentials: true,
        })
    }

    private async requestToAPI<T>(
        endpoint: string,
        method: string = 'GET',
        data?: any
    ): Promise<T> {
        if (import.meta.env.DEV) {
            console.log(`[MOCK] ${method} ${endpoint}`, data)

            if (endpoint === '/api/user/' && method === 'POST') {
                return {
                    id: 'mock-user-id',
                    email: data.email,
                    username: data.username ?? 'mockuser',
                } as T
            }

            if (endpoint.startsWith('/api/url/') && method === 'POST') {
                return {
                    id: 'mock-url-id',
                    original_url: data.original_url,
                    short_url: 'http://sho.rt/abc123',
                    user: data.user ?? 'mock-user-id',
                } as T
            }

            if (endpoint.startsWith('/api/url/user/') && method === 'GET') {
                return [
                    {
                        id: 'mock-url-1',
                        original_url: 'https://example.com/1',
                        short_url: 'http://sho.rt/abc1',
                        user: 'mock-user-id',
                    },
                    {
                        id: 'mock-url-2',
                        original_url: 'https://example.com/2',
                        short_url: 'http://sho.rt/abc2',
                        user: 'mock-user-id',
                    },
                ] as T
            }

            if (endpoint.startsWith('/api/url/') && method === 'GET') {
                return {
                    id: 'mock-url-id',
                    original_url: 'https://example.com',
                    short_url: 'http://sho.rt/abc123',
                    user: 'mock-user-id',
                } as T
            }

            if (endpoint === '/api/token/' && method === 'POST') {
                return {
                    id: 'mock-user-id',
                    email: data.get('username'),
                    username: 'mockuser',
                } as T
            }

            if (endpoint === '/api/token/refresh/' && method === 'POST') {
                return {} as T
            }

            if (
                (endpoint === '/api/token/logout/' || endpoint === '/api/token/revoke/') &&
                (method === 'DELETE')
            ) {
                return {} as T
            }

            throw new Error(`[MOCK] No mock for ${method} ${endpoint}`)
        }

        const response = await this.axiosInstance.request<T>({
            url: endpoint,
            method,
            data,
        })
        return response.data
    }

    private async request<T>(
        endpoint: string,
        method: string = 'GET',
        data?: any
    ): Promise<T> {
        console.log('request')
        try {
            return await this.requestToAPI<T>(endpoint, method, data)
        } catch (error: unknown) {
            console.log('error caught in request')
            if (axios.isAxiosError(error)) {
                console.error('axios error', error.response?.status, error.message)
                if (error.response?.status === 401) {
                    try {
                        await this.requestToAPI<void>('/api/token/refresh/', 'POST')
                        console.info('refresh endpoint done')
                        return await this.requestToAPI<T>(endpoint, method, data)
                    } catch (refreshError) {
                        console.error('refresh token error', refreshError)
                        throw new Error('Failed to refresh token')
                    }
                }
                throw new Error(error.message)
            }
            console.error('unexpected error', error)
            throw new Error('An unexpected error occurred')
        }
    }

    async createShortUrl(payload: UrlCreateRequest): Promise<UrlResponse> {
        return this.request<UrlResponse>('/api/url/', 'POST', payload)
    }

    async getUrlsByUser(
        userId: string,
        page: number = 1,
        size: number = 10
    ): Promise<UrlResponse[]> {
        return this.request<UrlResponse[]>(
            `/api/url/user/${userId}/?page=${page}&size=${size}`,
            'GET'
        )
    }

    async updateUrl(
        id: string,
        payload: Partial<UrlCreateRequest>
    ): Promise<UrlResponse> {
        return this.request<UrlResponse>(`/api/url/${id}/`, 'PATCH', payload)
    }

    async getUrlByHash(hash: string): Promise<UrlResponse> {
        return this.request<UrlResponse>(`/api/url/${hash}/`, 'GET')
    }

    async createUser(payload: UserCreateRequest): Promise<UserResponse> {
        return this.request<UserResponse>('/api/user/', 'POST', payload)
    }

    async getUserById(id: string): Promise<UserResponse> {
        return this.request<UserResponse>(`/api/user/${id}/`, 'GET')
    }

    async login(email: string, password: string): Promise<UserResponse> {
        const payload = new URLSearchParams()
        payload.append('username', email)
        payload.append('password', password)
        payload.append('grant_type', 'password')

        return this.request<UserResponse>('/api/token/', 'POST', payload)
    }

    async refreshToken(): Promise<void> {
        return this.request<void>('/api/token/refresh/', 'POST')
    }

    async revokeTokens(): Promise<void> {
        return this.request<void>('/api/token/revoke/', 'DELETE')
    }

    async logout(): Promise<void> {
        return this.request<void>('/api/token/logout/', 'DELETE')
    }
}
