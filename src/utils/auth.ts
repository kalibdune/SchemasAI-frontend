import axios, { AxiosInstance } from 'axios';
import { BASE_URL } from './constants';
import Cookies from 'js-cookie';  // Добавляем для работы с cookies
import {UserResponse} from "../types/authTypes.ts"


export class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: BASE_URL,
            withCredentials: true,
        });
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
        });
        return response.data;
    }

    private async request<T>(
        endpoint: string,
        method: string = 'GET',
        data?: any
    ): Promise<T> {
        try {
            return await this.requestToAPI<T>(endpoint, method, data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('axios error', error.response?.status, error.message);
                if (error.response?.status === 401) {
                    try {
                        await this.requestToAPI<void>('/api/token/refresh/', 'POST');
                        return await this.requestToAPI<T>(endpoint, method, data);
                    } catch (refreshError) {
                        console.error('refresh token error', refreshError);
                        throw new Error('Failed to refresh token');
                    }
                }
                throw new Error(error.message);
            }
            throw new Error('An unexpected error occurred');
        }
    }

    // Метод для авторизации
    async login(email: string, password: string): Promise<UserResponse> {
        const payload = new URLSearchParams();
        payload.append('username', email);
        payload.append('password', password);
        payload.append('grant_type', 'password');

        const response = await this.request<UserResponse>('/api/token/', 'POST', payload);

        // Сохраняем токены в cookies
        if (response.access_token) {
            Cookies.set('access_token', response.access_token, { expires: 1 });  // Сохраняем на 1 день
        }
        if (response.refresh_token) {
            Cookies.set('refresh_token', response.refresh_token, { expires: 7 });  // Сохраняем на 7 дней
        }

        return response;
    }

    // Метод для выхода
    async logout(): Promise<void> {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        return this.request<void>('/api/token/logout/', 'DELETE');
    }
}
