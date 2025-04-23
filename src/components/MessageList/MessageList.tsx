import { Message } from "../../types/types.ts";
import UserMessage from "../UserMessage/UserMessage.tsx";
import AIMessage from "../AIMessage/AIMessage.tsx"
import { useEffect, useRef } from "react";
import "./MessageList.scss"

interface MessageListProps {
    messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="messageList">
            {messages.map((msg, index) =>
                msg.sender_type === "user" ? (
                    <UserMessage key={msg.id || `user-msg-${index}`} content={msg.content} />
                ) : (
                    <AIMessage key={msg.id || `ai-msg-${index}`} content={msg.content} />
                )
            )}
            <div ref={bottomRef} />
        </div>
    );
}