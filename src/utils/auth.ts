import axios, { AxiosInstance, AxiosError } from 'axios';
import { VITE_BASE_URL } from './constants';
import { UserResponse, UserCreateRequest } from "../types/authTypes.ts";
import {Chat, Message} from "../types/types.ts";

// Расширенный интерфейс для ответа авторизации
interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: UserResponse;
}

// Интерфейс для ошибки API
interface ApiErrorResponse {
    detail?: string;
    message?: string;
}

export class ApiService {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: VITE_BASE_URL,
            withCredentials: true,
        });

        this.axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('access_token');
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
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
    }

    private async refreshToken(): Promise<string> {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            const response = await axios.post<{ access_token: string }>(
                `${VITE_BASE_URL}/api/token/refresh/`,
                { refresh_token: refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            );

            localStorage.setItem('access_token', response.data.access_token);
            return response.data.access_token;
        } catch (error) {
            this.handleAuthError();
            throw error;
        }
    }

    private async request<T>(method: string, url: string, data?: unknown): Promise<T> {
        try {
            const response = await this.axiosInstance.request<T>({ method, url, data });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                throw new Error(
                    axiosError.response?.data?.detail ||
                    axiosError.message ||
                    'Unknown error'
                );
            }
            throw new Error('Unknown error');
        }
    }

    // Auth methods
    async login(email: string, password: string): Promise<UserResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    const response = await axios.post<AuthResponse>(`${VITE_BASE_URL}/api/token/`, formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    // Сохраняем токены в localStorage
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('isAuthenticated', 'true');

    console.log('Токены сохранены в localStorage:', {
        access: !!localStorage.getItem('access_token'),
        refresh: !!localStorage.getItem('refresh_token')
    });

    // Возвращаем данные пользователя без редиректа
    return response.data.user;
}

    async register(userData: UserCreateRequest): Promise<UserResponse> {
        return this.request<UserResponse>('POST', '/api/user/', userData);
    }

    async getCurrentUser(): Promise<UserResponse> {
        try {
            const userId = this.getUserIdFromToken();
            console.log('Запрос пользователя с ID:', userId);
            return this.request<UserResponse>('GET', `/api/user/${userId}/`);
        } catch (error) {
            console.error('Ошибка getCurrentUser:', error);
            throw error;
        }
    }

    async updateUser(userData: Partial<UserCreateRequest>): Promise<UserResponse> {
        const userId = this.getUserIdFromToken();
        return this.request<UserResponse>('PATCH', `/api/user/${userId}/`, userData);
    }

    async logout(): Promise<void> {
        try {
            await this.request('POST', '/api/token/logout/');
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/login';
        }
    }


    private getUserIdFromToken(): string {
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error('No access token');

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decoded = window.atob(base64);
            const payload = JSON.parse(decoded);

            console.log('Содержимое токена JWT:', payload);

            // Проверяем все возможные поля, содержащие ID пользователя
            if (payload.sub) return payload.sub;
            if (payload.user_id) return payload.user_id;
            if (payload.id) return payload.id;
            if (payload.userId) return payload.userId;

            // Если ни одно из стандартных полей не найдено, пробуем найти первое поле с ID
            const possibleIdKeys = Object.keys(payload).filter(key =>
                key.toLowerCase().includes('id') ||
                key.toLowerCase().includes('user')
            );

            if (possibleIdKeys.length > 0) {
                console.log(`Найдено поле с ID: ${possibleIdKeys[0]} = ${payload[possibleIdKeys[0]]}`);
                return payload[possibleIdKeys[0]];
            }

            // Если не нашли ничего похожего на ID, просто выводим весь токен
            console.error('Структура токена:', payload);
            throw new Error('Не удалось найти ID пользователя в токене');
        } catch (error) {
            console.error('Ошибка разбора токена:', error);
            throw error;
        }
    }
    // Создание чата
    async createChat(title: string): Promise<Chat> {
        console.log('Отправка запроса на создание чата:', { title });
        return this.request<Chat>('POST', '/api/chat/', { title });
    }

    // Получение списка чатов
    async getChats(): Promise<Chat[]> {
        return this.request<Chat[]>('GET', '/api/chat/');
    }

    // Отправка сообщения
    async sendMessage(chatId: string, content: string): Promise<Message> {
        console.log('Отправка сообщения в чат:', chatId, content);
        return this.request<Message>('POST', `/api/chat/${chatId}/message/`, { content });
    }

    // Получение сообщений чата
    async getChatMessages(chatId: string): Promise<Message[]> {
        return this.request<Message[]>('GET', `/api/chat/${chatId}/message/`);
    }
}