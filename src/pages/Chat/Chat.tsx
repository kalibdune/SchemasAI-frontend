import SideBar from "../../components/SideBar/SideBar.tsx";
import ChatInput from "../../components/ChatInput/ChatInput.tsx";
import { useEffect, useState, useRef } from "react";
import {useSearchParams} from "react-router-dom";
import MessageList from "../../components/MessageList/MessageList.tsx";
import { Message, User } from "../../types/types.ts";
import { ApiService } from "../../utils/auth.ts";
import StorageService from "../../utils/storage.ts";
import { WebSocketService } from "../../utils/websocket.ts";
import Profile from "../../components/Profile/Profile.tsx";


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

    const handleLogout = () => {
        setUser(null);
    };

    return (
        <div className="flex w-full flex-col items-center justify-center">
            <Profile user={user} onLogout={handleLogout} />
            <div
                className="Background"
                style={{ width: '900px', height: '300px', top: '-130px', position: 'fixed', opacity: 0.3, background: 'rgba(255, 255, 255, 0.5)', zIndex: 3, filter: 'blur(100px)',}}
            ></div>
            <div
                className="Background"
                style={{ width: '900px', height: '300px', bottom: '-130px', position: 'fixed', opacity: 0.3, background: 'rgba(255, 255, 255, 0.5)', zIndex: 3, filter: 'blur(100px)',}}
            ></div>
            <div className="fixed z-5 bottom-1/32 right-1/32">
                {wsConnected ? '🟢' : '🔴'}
            </div>
            <svg width="109" height="38" viewBox="0 0 109 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="fixed bottom-11/12" style={{zIndex: 5 }}>
                <rect y="7" width="24" height="24" fill="white"/>
                <path d="M42.7539 30V8.8623H47.0898L53.4473 25.1221H53.6963L60.0391 8.8623H64.375V30H60.9766V14.9707H60.7129L54.8535 30H52.2754L46.416 14.9707H46.167V30H42.7539ZM75.1416 30V12.041H68.6377V8.8623H85.4395V12.041H78.9209V30H75.1416ZM97.627 30.5273C91.6357 30.5273 87.915 26.2793 87.915 19.4531V19.4238C87.915 12.5684 91.6211 8.33496 97.6123 8.33496C102.417 8.33496 106.064 11.3818 106.562 15.7031V15.8203H102.856L102.842 15.7617C102.3 13.2568 100.278 11.6016 97.6123 11.6016C94.0234 11.6016 91.7822 14.6045 91.7822 19.4092V19.4385C91.7822 24.2578 94.0234 27.2607 97.627 27.2607C100.308 27.2607 102.3 25.7666 102.842 23.4375L102.856 23.3643H106.562V23.4668C106.006 27.7002 102.505 30.5273 97.627 30.5273Z" fill="white"/>
            </svg>
            <div className="flex flex-col items-center w-full">
                <SideBar />
                {messages.length === 0
                    ? (
                        <>
                            <div className="flex flex-col items-center flex-1" style={{height: "90vh", paddingBottom: "40px"}} >
                                {messages.length === 0 && (
                                    <div className="flex flex-col gap-1 text-center">
                                        <h2 className="text-4xl">Добро пожаловать!</h2>
                                        <p>Введите ваш первый запрос</p>
                                    </div>
                                )}
                            </div>
                            <div className="min-w-1/3" style={{paddingBottom:'40px'}}>
                                <ChatInput onSendMessage={handleSendMessage} />
                            </div>
                        </>
                    )
                    : (
                    <>
                        <div style={{height:'100vh', zIndex: "3"}}>
                            <MessageList messages={messages} />
                        </div>
                        <div className="min-w-1/3 fixed bottom-2" style={{paddingBottom:'40px', zIndex: "4"}}>
                            <ChatInput onSendMessage={handleSendMessage} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}