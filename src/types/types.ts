// types.ts
export type SenderType = "user" | "ai";

export interface Message {
    id: string; // UUID
    content: string;
    chat_id: string;
    sender_type: SenderType;
    created_at: string;
    updated_at: string;
}

export interface Chat {
    id: string;
    name: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
}
