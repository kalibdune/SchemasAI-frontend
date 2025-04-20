import { useState, useEffect } from "react";
import Loader from "../Loader/Loader.tsx";
import "./SideBarHistory.scss"


type ChatHistory = {
    id: string;
    name: string;
};

export default function SideBarHistory() {
    const [chats, setChats] = useState<ChatHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch("/api/chats")
            .then(res => res.json())
            .then((data: ChatHistory[]) => setChats(data))
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const handleDeleteChat = async (chatId: string) => {
        try {
            setDeletingId(chatId);
            const response = await fetch(`/api/chats/${chatId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete chat");
            setChats(prev => prev.filter((c) => c.id !== chatId));
        } catch (err) {
            console.error("Could not delete chat", err);
        } finally {
            setDeletingId(null);
        }
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
                        <div>
                            {chats.map((chat: ChatHistory) => (
                                <div key={chat.id}>
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
                                            onClick={() => handleDeleteChat(chat.id)}
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
