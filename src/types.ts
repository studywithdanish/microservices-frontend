export interface Role {
    id: number;
    name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    about: string;
    roles: Role[];
}

export interface Category {
    categoryId: number;
    categoryTitle: string;
    categoryDescription?: string;
}

export interface Post {
    postId: number;
    title: string;
    content: string;
    authorId: number;
    addedDate?: string;
    category?: Category;
}

export interface PostDraft {
    title: string;
    content: string;
}

export interface NewPost extends PostDraft {
    categoryId: string;
}

export interface PostPage {
    content: Post[];
    pageNo: number;
    pageSize: number;
    totalElement: number;
    totalPages: number;
    lastPage: boolean;
}

export interface Comment {
    id: number;
    content: string;
    postId: number;
    authorId: number;
}

export interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    postId: number;
    read: boolean;
    createdAt?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegistrationRequest {
    name: string;
    email: string;
    password: string;
    about: string;
}

export interface AuthResponse {
    authenticated: boolean;
}

export interface ApiMessage {
    message: string;
    success: boolean;
}
