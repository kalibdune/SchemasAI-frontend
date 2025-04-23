import { useState, useEffect } from "react";
import Loader from "../Loader/Loader.tsx";
import "./SideBarHistory.scss";
import { ApiService } from "../../utils/auth.ts";
import { ChatResponse } from "../../types/authTypes";
import { useNavigate } from "react-router-dom";

type SideBarHistoryProps = {
    newChat?: ChatResponse | null;
};

export default function SideBarHistory({ newChat }: SideBarHistoryProps) {
    const [chats, setChats] = useState<ChatResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const api = new ApiService();
    const navigate = useNavigate();

    useEffect(() => {
        fetchChats();
    }, []);

    useEffect(() => {
        if (newChat && !chats.find(chat => chat.id === newChat.id)) {
            setChats(prev => [newChat, ...prev]);
        }
    }, [newChat]);

    async function fetchChats() {
        setLoading(true);
        try {
            const chatsData = await api.getChats();
            setChats(chatsData);
        } catch (error) {
            console.error("Ошибка при получении списка чатов:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteChat = async (chatId: string, event: React.MouseEvent) => {
        // Предотвращаем всплытие события, чтобы не срабатывал клик по родительскому элементу
        event.stopPropagation();
        try {
            setDeletingId(chatId);
            await api.deleteChat(chatId);
            setChats(prev => prev.filter((c) => c.id !== chatId));
        } catch (error) {
            console.error("Ошибка при удалении чата:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleChatClick = (chatId: string) => {
        navigate(`/chat?chatId=${chatId}`);
    };

    return (
        <div>
            {loading ? (
                <div className="flex justify-center">
                    <Loader />
                </div>
            ) : (
                <>
                    {chats.length === 0 ? (
                        <span className="flex justify-center">
                            Нет чатов
                        </span>
                    ) : (
                        <div className="sidebar-history">
                            {chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => handleChatClick(chat.id)}
                                    className="sidebar-history-item"
                                >
                                    <span>{chat.name}</span>
                                    {deletingId === chat.id ? (
                                        <Loader />
                                    ) : (
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            onClick={(e) => handleDeleteChat(chat.id, e)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <path
                                                d="M8.00033 2C7.26699 2 6.66699 2.6 6.66699 3.33333C6.66699 4.06667 7.26699 4.66667 8.00033 4.66667C8.73366 4.66667 9.33366 4.06667 9.33366 3.33333C9.33366 2.6 8.73366 2 8.00033 2ZM8.00033 11.3333C7.26699 11.3333 6.66699 11.9333 6.66699 12.6667C6.66699 13.4 7.26699 14 8.00033 14C8.73366 14 9.33366 13.4 9.33366 12.6667C9.33366 11.9333 8.73366 11.3333 8.00033 11.3333ZM8.00033 6.66667C7.26699 6.66667 6.66699 7.26667 6.66699 8C6.66699 8.73333 7.26699 9.33333 8.00033 9.33333C8.73366 9.33333 9.33366 8.73333 9.33366 8C9.33366 7.26667 8.73366 6.66667 8.00033 6.66667Z"
                                                fill="white"
                                                fillOpacity="0.85"
                                            />
                                        </svg>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}