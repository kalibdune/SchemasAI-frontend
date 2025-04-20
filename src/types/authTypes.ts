export interface UrlCreateRequest {
    url: string
    expiration_time?: Date | null
}

export interface UrlResponse {
    url: string
    hash: string
    expired_at: string | null
    user_id: string | null
    id: string
    created_at: string
    updated_at: string
}

export interface UserCreateRequest {
    name: string
    email: string
    password: string
}

export interface UserResponse {
    name: string
    email: string
    id: string
    created_at: string
    updated_at: string
}
