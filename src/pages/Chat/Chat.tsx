import SideBar from "../../components/SideBar/SideBar.tsx";
import ChatInput from "../../components/ChatInput/ChatInput.tsx";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import MessageList from "../../components/MessageList/MessageList.tsx";
import { Message, User } from "../../types/types.ts";
import Background from "../../components/Background/Background.tsx";
import { ApiService } from "../../utils/auth.ts";
import StorageService from "../../utils/storage.ts";
import { WebSocketService } from "../../utils/websocket.ts";

export default function Chat() {
    const api = new ApiService();
    const storage = new StorageService();
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const chatId = searchParams.get("chatId");
    const wsRef = useRef<WebSocketService | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);

    // Загрузка сообщений и данных пользователя
    useEffect(() => {
        async function fetchMessages() {
            if (!chatId) return;

            try {
                const data = await api.getMessagesByChatId(chatId, { "start": "last", "count": 20 });
                console.log('Получены сообщения из API:', data);

                // Преобразуем ответ API в формат Message
                const mappedMessages = data.map(msg => ({
                    id: msg.id,
                    content: msg.content || '',
                    chat_id: msg.chat_id || chatId,
                    sender_type: msg.sender_type || 'user',
                    created_at: msg.created_at || new Date().toISOString(),
                    updated_at: msg.updated_at || new Date().toISOString()
                })) as Message[];

                setMessages(mappedMessages.reverse());
            } catch (error) {
                console.error("Ошибка при загрузке сообщений:", error);
            }
        }

        const saved_user = storage.getItem("user");
        if (saved_user) {
            setUser(saved_user as User);
        } else {
            console.error("Пользователь не найден в хранилище");
        }

        fetchMessages();
    }, [chatId]);

    // Установка WebSocket соединения
    useEffect(() => {
        if (!chatId || !user || isConnecting) return;

        setIsConnecting(true);

        // Создаем экземпляр WebSocketService
        const wsService = new WebSocketService({
            onMessage: (message: Message) => {
                console.log('Получено сообщение через WebSocket:', message);

                // Добавляем новое сообщение, проверяя его уникальность
                setMessages(prevMessages => {
                    // Проверяем, не существует ли уже сообщение с таким id
                    const exists = prevMessages.some(msg => msg.id === message.id);

                    // Игнорируем только дубликаты
                    if (exists) {
                        console.log('Сообщение проигнорировано (дубликат)');
                        return prevMessages;
                    }

                    console.log('Добавлено новое сообщение в чат');
                    console.log([...prevMessages, message])
                    console.log(message.content)
                    return [...prevMessages, message];
                });
            },
            onOpen: () => {
                console.log("WebSocket соединение установлено");
                setIsConnecting(false);
                setWsConnected(true);
            },
            onClose: () => {
                console.log("WebSocket соединение закрыто");
                setWsConnected(false);
            },
            onError: (error) => {
                console.error("Ошибка WebSocket:", error);
                setIsConnecting(false);
                setWsConnected(false);
            }
        });

        // Подключаемся к WebSocket
        wsService.connect(chatId);
        wsRef.current = wsService;

        // Очистка при размонтировании компонента
        return () => {
            if (wsRef.current) {
                wsRef.current.disconnect();
                wsRef.current = null;
                setWsConnected(false);
            }
        };
    }, [chatId, user]);

    // Обработчик отправки сообщения
    const handleSendMessage = async (newMessage: { text: string }) => {
        if (!chatId || !user) return;

        // Создаем временный ID для оптимистичного обновления UI
        const tempId = `temp-${Date.now()}`;

        // Создаем объект сообщения
        const typedMessage: Message = {
            id: tempId,
            content: newMessage.text,
            chat_id: chatId,
            sender_type: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Оптимистично добавляем сообщение в локальное состояние
        setMessages(prevMessages => [...prevMessages, typedMessage]);

        try {
            // Отправляем через WebSocket
            if (wsRef.current && wsRef.current.isConnected) {
                console.log("Отправка сообщения через WebSocket");
                wsRef.current.sendMessage({
                    content: newMessage.text,
                    sender_type: "user",
                });
            } else {
                console.error('WebSocket не подключен, сообщение не может быть отправлено');
                // Помечаем сообщение как не отправленное
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === tempId ? { ...msg, error: true } : msg
                    )
                );
            }
        } catch (error) {
            console.error('Ошибка при отправке сообщения:', error);
            // Помечаем сообщение как не отправленное
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg.id === tempId ? { ...msg, error: true } : msg
                )
            );
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                <SideBar />
                <div className="chat-main">

                    <div className="chat-content">
                        <Background />
                        <MessageList messages={messages} />
                    </div>

                    <div className="chat-footer">
                        <ChatInput onSendMessage={handleSendMessage} />
                    </div>
                </div>
            </div>
        </div>
    );
}