import axios, { AxiosInstance, AxiosError } from 'axios';
import { VITE_BASE_URL } from './constants';
import Cookies from 'js-cookie';
import { UserResponse, UserCreateRequest } from "../types/authTypes.ts";

export class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: VITE_BASE_URL,
            withCredentials: true,
        });

        this.axiosInstance.interceptors.request.use((config) => {
            const token = Cookies.get('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        this.axiosInstance.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const newToken = await this.refreshToken();
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return this.axiosInstance(originalRequest);
                    } catch (refreshError) {
                        this.handleAuthError();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    private handleAuthError() {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
    }

    private async refreshToken(): Promise<string> {
        try {
            const refreshToken = Cookies.get('refresh_token');
            const response = await axios.post<{ access_token: string }>(
                `${VITE_BASE_URL}/api/token/refresh/`,
                { refresh_token: refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            );

            Cookies.set('access_token', response.data.access_token, { expires: 1 });
            return response.data.access_token;
        } catch (error) {
            this.handleAuthError();
            throw error;
        }
    }

    private async request<T>(method: string, url: string, data?: any): Promise<T> {
        try {
            const response = await this.axiosInstance.request<T>({ method, url, data });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                throw new Error(
                    (axiosError.response?.data as any)?.detail ||
                    axiosError.message ||
                    'Unknown error'
                );
            }
            throw new Error('Unknown error');
        }
    }

    // Auth methods
    async login(email: string, password: string) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        formData.append('grant_type', 'password');

        const response = await axios.post<{
            access_token: string,
            refresh_token: string,
            user: UserResponse
        }>(`${VITE_BASE_URL}/api/token/`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // Сохраняем токены из тела ответа
        const { access_token, refresh_token } = response.data;

        Cookies.set('access_token', access_token, {
            expires: 1,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        Cookies.set('refresh_token', refresh_token, {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return response.data.user;
    }

    async register(userData: UserCreateRequest): Promise<UserResponse> {
        return this.request<UserResponse>('POST', '/api/user/', userData);
    }

    async getCurrentUser(): Promise<UserResponse> {
        const userId = await this.getUserIdFromToken();
        return this.request<UserResponse>('GET', `/api/user/${userId}/`);
    }

    async updateUser(userData: Partial<UserCreateRequest>): Promise<UserResponse> {
        const userId = await this.getUserIdFromToken();
        return this.request<UserResponse>('PATCH', `/api/user/${userId}/`, userData);
    }

    async logout(): Promise<void> {
        try {
            await this.request('POST', '/api/token/logout/');
        } finally {
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
            window.location.href = '/login';
        }
    }

    private getUserIdFromToken(): string {
        const token = Cookies.get('access_token');
        if (!token) throw new Error('No access token');

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));

            if (!payload.sub && !payload.user_id) {
                throw new Error('Invalid token payload');
            }

            return payload.sub || payload.user_id;
        } catch (e) {
            throw new Error('Invalid token format');
        }
    }
}