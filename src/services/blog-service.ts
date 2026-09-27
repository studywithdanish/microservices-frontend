import { myAxios } from "./helper";
import type { ApiMessage, Category, Comment, Notification, Post, PostDraft, PostPage, User } from "../types";

export const getCurrentUser = async (): Promise<User> =>
    (await myAxios.get<User>("/api/v1/auth/me")).data;

export const getCategories = async (): Promise<Category[]> =>
    (await myAxios.get<Category[]>("/api/categories")).data;

export const getPosts = async ({ pageNo = 0, pageSize = 5 } = {}): Promise<PostPage> =>
    (await myAxios.get<PostPage>("/api/posts", {
        params: { pageNo, pageSize, sortBy: "addedDate", sortDir: "desc" },
    })).data;

export const createPost = async (post: PostDraft & { categoryId: number }): Promise<Post> =>
    (await myAxios.post<Post>("/api/posts", post)).data;

export const updatePost = async (postId: number, post: PostDraft): Promise<Post> =>
    (await myAxios.put<Post>(`/api/post/${postId}`, post)).data;

export const deletePost = async (postId: number): Promise<ApiMessage> =>
    (await myAxios.delete<ApiMessage>(`/api/post/${postId}`)).data;

export const searchPosts = async (keywords: string): Promise<Post[]> =>
    (await myAxios.get<Post[]>(`/api/posts/search/${encodeURIComponent(keywords)}`)).data;

export const getComments = async (postId: number): Promise<Comment[]> =>
    (await myAxios.get<Comment[]>(`/api/posts/${postId}/comments`)).data;

export const createComment = async (postId: number, content: string): Promise<Comment> =>
    (await myAxios.post<Comment>(`/api/posts/${postId}/comments`, { content })).data;

export const deleteComment = async (commentId: number): Promise<ApiMessage> =>
    (await myAxios.delete<ApiMessage>(`/api/comments/${commentId}`)).data;

export const getNotifications = async (): Promise<Notification[]> =>
    (await myAxios.get<Notification[]>("/api/notifications")).data;

export const markNotificationRead = async (notificationId: number): Promise<Notification> =>
    (await myAxios.put<Notification>(`/api/notifications/${notificationId}/read`)).data;
