export type UUID = string;
export type DateTimeString = string;

export enum SenderType {
    AI = 'ai',
    USER = 'user'
}

export interface UserCreateRequest {
    name: string;
    email: string;
    password: string;
}

export interface UserUpdateRequest {
    name?: string | null;
    email?: string | null;
}

export interface ChatCreateRequest {
    name: string;
}

export interface ChatUpdateRequest {
    name?: string | null;
}

export interface MessageCreateRequest {
    content: string;
    sender_type: SenderType;
}

export interface MessageUpdateRequest {
    content: string | null;
}

export interface UserResponse {
    name: string;
    email: string;
    id: UUID;
    created_at: DateTimeString;
    updated_at: DateTimeString;
}

export interface ChatResponse {
    name: string;
    id: UUID;
    created_at: DateTimeString;
    updated_at: DateTimeString;
    user_id: UUID;
}

export interface MessageResponse {
    content: string;
    sender_type: SenderType;
    chat_id: UUID;
    id: UUID;
    created_at: DateTimeString;
    updated_at: DateTimeString;
}

export interface RevokedTokensResponse {
    revoked_count: number;
}

export interface GetMessagesParams {
    start: string;
    count: number;
}