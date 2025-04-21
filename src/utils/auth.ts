import axios, { AxiosInstance } from 'axios'
import { BASE_URL } from './constants'
import {
    ChatCreateRequest,
    ChatResponse,
    ChatUpdateRequest,
    GetMessagesParams,
    MessageCreateRequest,
    MessageResponse,
    MessageUpdateRequest,
    UserCreateRequest,
    UserResponse,
    UUID,
} from '../types/authTypes'

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
        console.log("request")
        try {
            return await this.requestToAPI<T>(endpoint, method, data)
        } catch (error: unknown) {
            console.log("error caught in request")
            if (axios.isAxiosError(error)) {
                console.error("axios error", error.response?.status, error.message)
                if (error.response?.status === 401) {
                    try {
                        await this.requestToAPI<void>('/api/token/refresh/', 'POST')
                        console.info("refresh endpoint done")
                        return await this.requestToAPI<T>(endpoint, method, data)
                    } catch (refreshError) {
                        console.error("refresh token error", refreshError)
                        throw new Error('Failed to refresh token')
                    }
                }
                throw new Error(error.message)
            }
            console.error("unexpected error", error)
            throw new Error('An unexpected error occurred')
        }
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
    async createChat(payload: ChatCreateRequest): Promise<ChatResponse> {
        return this.request<ChatResponse>('/api/chat/', 'POST', payload)
    }

    async getChats(): Promise<ChatResponse[]> {
        return this.request<ChatResponse[]>('/api/chat/chats/', 'GET')
    }

    async getChatById(id: UUID): Promise<ChatResponse> {
        return this.request<ChatResponse>(`/api/chat/${id}/`, 'GET')
    }

    async updateChat(id: UUID, payload: ChatUpdateRequest): Promise<ChatResponse> {
        return this.request<ChatResponse>(`/api/chat/${id}/`, 'PATCH', payload)
    }

    async deleteChat(id: UUID): Promise<void> {
        return this.request<void>(`/api/chat/${id}/`, 'DELETE')
    }

    async createMessage(chatId: UUID, payload: MessageCreateRequest): Promise<MessageResponse> {
        return this.request<MessageResponse>(`/api/message/chat/${chatId}`, 'POST', payload)
    }

    async getMessagesByChatId(chatId: UUID, params: GetMessagesParams): Promise<MessageResponse[]> {
        return this.request<MessageResponse[]>(`/api/message/chat/${chatId}?start=${params.start}&count=${params.count}`, 'GET')
    }

    async getMessageById(id: UUID): Promise<MessageResponse> {
        return this.request<MessageResponse>(`/api/message/${id}`, 'GET')
    }

    async updateMessage(id: UUID, payload: MessageUpdateRequest): Promise<MessageResponse> {
        return this.request<MessageResponse>(`/api/message/${id}`, 'PATCH', payload)
    }

    async deleteMessage(id: UUID): Promise<void> {
        return this.request<void>(`/api/message/${id}`, 'DELETE')
    }

}