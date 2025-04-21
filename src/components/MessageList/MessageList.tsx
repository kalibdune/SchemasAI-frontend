import { Message } from "../../types/types.ts";
import UserMessage from "../UserMessage/UserMessage.tsx";
import AIMessage from "../AIMessage/AIMessage.tsx"
import { useEffect, useRef } from "react";

interface MessageListProps {
    messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="w-full flex flex-col gap-4 p-4 overflow-y-auto" style={{ paddingTop: "100px", minWidth: "900px" }}>
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