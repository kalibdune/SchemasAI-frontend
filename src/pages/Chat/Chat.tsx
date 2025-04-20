import SideBar from "../../components/SideBar/SideBar.tsx";
import ChatInput from "../../components/ChatInput/ChatInput.tsx";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MessageList from "../../components/MessageList/MessageList.tsx";
import { Message } from "../../types/types.ts";
import Background from "../../components/Background/Background.tsx";

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [searchParams] = useSearchParams();
    const chatId = searchParams.get("chatId");

    useEffect(() => {
        async function fetchMessages() {
            if (!chatId) return;

            try {
                const response = await fetch(`/api/message/chat/${chatId}?start=last&count=10`);
                if (!response.ok) throw new Error("Ошибка загрузки сообщений");

                const data: Message[] = await response.json();
                setMessages(data);
            } catch (error) {
                console.error("Ошибка:", error);
            }
        }

        fetchMessages();
    }, [chatId]);

    return (
        <div className="flex w-full flex-col items-center justify-center">
            <Background/>
            <div>
                <div style={{ backgroundColor: "rgba(255,255,255,0.25)", border: "1px solid white", borderRadius: "50%", padding: "8px", cursor: "pointer", zIndex: 3 }} className="fixed top-1/32 right-1/32">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C12.12 11.49 12.13 11.49 12.15 11.49C12.16 11.49 12.16 11.49 12.17 11.49C14.73 11.4 16.74 9.32 16.75 6.75C16.75 4.13 14.62 2 12 2Z" fill="white"/>
                        <path d="M17.0809 14.15C14.2909 12.29 9.74094 12.29 6.93094 14.15C5.66094 15 4.96094 16.15 4.96094 17.38C4.96094 18.61 5.66094 19.75 6.92094 20.59C8.32094 21.53 10.1609 22 12.0009 22C13.8409 22 15.6809 21.53 17.0809 20.59C18.3409 19.74 19.0409 18.6 19.0409 17.36C19.0309 16.13 18.3409 14.99 17.0809 14.15Z" fill="white"/>
                    </svg>
                </div>

            </div>
            <svg width="109" height="38" viewBox="0 0 109 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="fixed bottom-11/12" style={{zIndex: 3 }}>
                <rect y="7" width="24" height="24" fill="white"/>
                <path d="M42.7539 30V8.8623H47.0898L53.4473 25.1221H53.6963L60.0391 8.8623H64.375V30H60.9766V14.9707H60.7129L54.8535 30H52.2754L46.416 14.9707H46.167V30H42.7539ZM75.1416 30V12.041H68.6377V8.8623H85.4395V12.041H78.9209V30H75.1416ZM97.627 30.5273C91.6357 30.5273 87.915 26.2793 87.915 19.4531V19.4238C87.915 12.5684 91.6211 8.33496 97.6123 8.33496C102.417 8.33496 106.064 11.3818 106.562 15.7031V15.8203H102.856L102.842 15.7617C102.3 13.2568 100.278 11.6016 97.6123 11.6016C94.0234 11.6016 91.7822 14.6045 91.7822 19.4092V19.4385C91.7822 24.2578 94.0234 27.2607 97.627 27.2607C100.308 27.2607 102.3 25.7666 102.842 23.4375L102.856 23.3643H106.562V23.4668C106.006 27.7002 102.505 30.5273 97.627 30.5273Z" fill="white"/>
            </svg>
            <div className="flex flex-col items-center w-full h-screen">
                <SideBar />
                <div className="flex flex-col items-center flex-1 overflow-y-auto px-4">
                    {messages.length === 0 && (
                        <div className="flex flex-col gap-1 text-center mt-10">
                            <h2 className="text-4xl">Добро пожаловать!</h2>
                            <p>Введите ваш первый запрос</p>
                        </div>
                    )}
                    <MessageList messages={messages} />
                </div>
                <div className="min-w-1/3" style={{paddingBottom:'40px'}}>
                    <ChatInput />
                </div>
            </div>
        </div>
    )
}