import { Message } from '../types/types';
import { BASE_URL } from './constants';

type WebSocketEventHandlers = {
    onMessage: (message: Message) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: Event) => void;
};

interface WebSocketMessage {
    content: string;
    sender_type: "user" | "ai";
    context?: string; // Опциональное поле для контекста
}

export class WebSocketService {
    private socket: WebSocket | null = null;
    private handlers: WebSocketEventHandlers;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: number = 3000;
    private chatId: string | null = null;

    constructor(handlers: WebSocketEventHandlers) {
        this.handlers = handlers;
    }

    connect(chatId: string) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.disconnect();
        }
        this.chatId = chatId;
        const wsUrl = `${BASE_URL}/api/ws/${chatId}`;
        console.log('Подключение к WebSocket:', wsUrl);

        this.socket = new WebSocket(wsUrl);
        this.socket.onopen = () => {
            console.log('WebSocket соединение установлено для чата:', chatId);
            this.reconnectAttempts = 0;
            this.handlers.onOpen?.();
        };
        this.socket.onmessage = (event) => {
            try {
                console.log('Получено сообщение WebSocket:', event.data);
                const data = JSON.parse(event.data) as WebSocketMessage;
                if (data) {
                    this.handlers.onMessage(this.normalizeMessage(data, chatId));
                }
            } catch (error) {
                console.error('Ошибка при обработке сообщения WebSocket:', error);
            }
        };
        this.socket.onclose = (event) => {
            console.log('WebSocket соединение закрыто:', event.code, event.reason);
            this.handlers.onClose?.();
            if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnectAttempts++;
                console.log(`Попытка переподключения ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
                setTimeout(() => this.reconnect(), this.reconnectTimeout);
            }
        };
        this.socket.onerror = (error) => {
            console.error('Ошибка WebSocket:', error);
            this.handlers.onError?.(error);
        };
    }

    private normalizeMessage(message: any, chatId: string): Message {
        const parsed_message = JSON.parse(message)
        const content = parsed_message.content

        const id = message.id || `ws-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

        return {
            id: id,
            content: content,
            chat_id: message.chat_id || chatId,
            sender_type: message.sender_type || 'ai',
            created_at: message.created_at || new Date().toISOString(),
            updated_at: message.updated_at || new Date().toISOString(),
        }
    }



    sendMessage(message: WebSocketMessage) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            if (!message.content.trim()) {
                console.error('Невозможно отправить пустое сообщение');
                return false;
            }
            const messagePayload = {
                content: message.content.trim(),
                sender_type: message.sender_type,
                context: message.context // Добавляем поле context
            };
            console.log('Отправка сообщения через WebSocket:', messagePayload);
            this.socket.send(JSON.stringify(messagePayload));
            return true;
        } else {
            console.error('Невозможно отправить сообщение: WebSocket не подключен');
            return false;
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close(1000, 'Закрытие соединения пользователем');
            this.socket = null;
        }
    }

    private reconnect() {
        if (this.chatId) {
            this.connect(this.chatId);
        }
    }

    get isConnected(): boolean {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }
}