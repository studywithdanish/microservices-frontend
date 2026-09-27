import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
    createComment,
    createPost,
    deleteComment,
    deletePost,
    getCategories,
    getComments,
    getNotifications,
    getPosts,
    markNotificationRead,
    searchPosts,
    updatePost,
} from "../../services/blog-service";
import type { Comment, NewPost, Notification, Post, PostDraft, PostPage } from "../../types";

const PAGE_SIZE = 5;
const initialPost: NewPost = { title: "", content: "", categoryId: "" };
const emptyPage: PostPage = {
    content: [], pageNo: 0, pageSize: PAGE_SIZE, totalElement: 0, totalPages: 0, lastPage: true,
};

const getMessage = (error: unknown, fallback: string): string => {
    if (isAxiosError<{ message?: string }>(error)) return error.response?.data?.message || fallback;
    return fallback;
};

const normalizeSearch = (posts: Post[]): PostPage => ({
    ...emptyPage,
    content: posts,
    totalElement: posts.length,
    totalPages: posts.length ? 1 : 0,
});

export const useDashboard = () => {
    const queryClient = useQueryClient();
    const { user: currentUser } = useAuth();
    const [newPost, setNewPost] = useState<NewPost>(initialPost);
    const [commentsByPost, setCommentsByPost] = useState<Record<number, Comment[]>>({});
    const [commentDrafts, setCommentDrafts] = useState<Record<number, string>>({});
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [pageNo, setPageNo] = useState(0);

    const categoriesQuery = useQuery({
        queryKey: ["dashboard", "categories"],
        queryFn: getCategories,
    });
    const categories = categoriesQuery.data ?? [];

    useEffect(() => {
        if (categories[0]) {
            setNewPost((current) => current.categoryId
                ? current
                : { ...current, categoryId: String(categories[0].categoryId) });
        }
    }, [categories]);

    const postsQuery = useQuery({
        queryKey: ["dashboard", "posts", { pageNo, activeSearch }],
        queryFn: async () => activeSearch
            ? normalizeSearch(await searchPosts(activeSearch))
            : getPosts({ pageNo, pageSize: PAGE_SIZE }),
        placeholderData: (previous) => previous,
    });
    const pagination = postsQuery.data ?? emptyPage;
    const posts = pagination.content;

    const notificationsQuery = useQuery({
        queryKey: ["dashboard", "notifications"],
        queryFn: getNotifications,
        refetchInterval: 30_000,
    });
    const notifications = notificationsQuery.data ?? [];

    const createPostMutation = useMutation({
        mutationFn: createPost,
        onSuccess: async () => {
            setNewPost((current) => ({ ...initialPost, categoryId: current.categoryId }));
            setSearchInput("");
            setActiveSearch("");
            setPageNo(0);
            await queryClient.invalidateQueries({ queryKey: ["dashboard", "posts"] });
            await queryClient.invalidateQueries({ queryKey: ["dashboard", "notifications"] });
            toast.success("Post created. Kafka notification updates automatically.");
        },
        onError: (error) => toast.error(getMessage(error, "Unable to create the post.")),
    });

    const updatePostMutation = useMutation({
        mutationFn: ({ postId, draft }: { postId: number; draft: PostDraft }) => updatePost(postId, draft),
        onSuccess: (saved) => {
            queryClient.setQueriesData<PostPage>({ queryKey: ["dashboard", "posts"] }, (current) => current ? ({
                ...current,
                content: current.content.map((post) => post.postId === saved.postId ? saved : post),
            }) : current);
            toast.success("Post updated successfully.");
        },
        onError: (error) => toast.error(getMessage(error, "Unable to update the post.")),
    });

    const deletePostMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: async (_, postId) => {
            setCommentsByPost((current) => {
                const next = { ...current };
                delete next[postId];
                return next;
            });
            if (posts.length === 1 && pageNo > 0 && !activeSearch) setPageNo((current) => current - 1);
            await queryClient.invalidateQueries({ queryKey: ["dashboard", "posts"] });
            toast.success("Post deleted successfully.");
        },
        onError: (error) => toast.error(getMessage(error, "Unable to delete the post.")),
    });

    const createCommentMutation = useMutation({
        mutationFn: ({ postId, content }: { postId: number; content: string }) => createComment(postId, content),
        onSuccess: (created, { postId }) => {
            setCommentsByPost((current) => ({ ...current, [postId]: [...(current[postId] || []), created] }));
            setCommentDrafts((current) => ({ ...current, [postId]: "" }));
            toast.success("Comment created through the Content Service.");
        },
        onError: (error) => toast.error(getMessage(error, "Unable to create the comment.")),
    });

    const deleteCommentMutation = useMutation({
        mutationFn: ({ commentId }: { postId: number; commentId: number }) => deleteComment(commentId),
        onSuccess: (_, { postId, commentId }) => {
            setCommentsByPost((current) => ({
                ...current,
                [postId]: (current[postId] || []).filter((comment) => comment.id !== commentId),
            }));
            toast.success("Comment deleted successfully.");
        },
        onError: (error) => toast.error(getMessage(error, "Unable to delete the comment.")),
    });

    const markReadMutation = useMutation({
        mutationFn: markNotificationRead,
        onSuccess: (updated) => {
            queryClient.setQueryData<Notification[]>(["dashboard", "notifications"], (current = []) =>
                current.map((notification) => notification.id === updated.id ? updated : notification));
        },
        onError: (error) => toast.error(getMessage(error, "Unable to mark the notification as read.")),
    });

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        setPageNo(0);
        setActiveSearch(searchInput.trim());
    };

    const clearSearch = () => {
        setSearchInput("");
        setActiveSearch("");
        setPageNo(0);
    };

    const handlePostChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setNewPost((current) => ({ ...current, [name]: value }));
    };

    const submitPost = (event: FormEvent) => {
        event.preventDefault();
        if (!newPost.title.trim() || !newPost.content.trim() || !newPost.categoryId) {
            toast.error("Title, content, and category are required.");
            return;
        }
        createPostMutation.mutate({
            title: newPost.title.trim(),
            content: newPost.content.trim(),
            categoryId: Number(newPost.categoryId),
        });
    };

    const savePost = async (postId: number, draft: PostDraft): Promise<boolean> => {
        if (!draft.title.trim() || !draft.content.trim()) {
            toast.error("Title and content are required.");
            return false;
        }
        try {
            await updatePostMutation.mutateAsync({ postId, draft: { title: draft.title.trim(), content: draft.content.trim() } });
            return true;
        } catch { return false; }
    };

    const loadComments = async (postId: number): Promise<void> => {
        if (Object.hasOwn(commentsByPost, postId)) {
            setCommentsByPost((current) => {
                const next = { ...current };
                delete next[postId];
                return next;
            });
            return;
        }
        try {
            const comments = await queryClient.fetchQuery({ queryKey: ["dashboard", "comments", postId], queryFn: () => getComments(postId) });
            setCommentsByPost((current) => ({ ...current, [postId]: comments }));
        } catch (error) { toast.error(getMessage(error, "Unable to load comments.")); }
    };

    const submitComment = (event: FormEvent, postId: number) => {
        event.preventDefault();
        const content = commentDrafts[postId]?.trim();
        if (!content) return toast.error("Comment content is required.");
        createCommentMutation.mutate({ postId, content });
    };

    return {
        activeSearch, categories, currentUser, newPost, commentsByPost, commentDrafts,
        posts, pagination, pageNo, searchInput, setSearchInput,
        loading: categoriesQuery.isPending || postsQuery.isPending,
        loadingNotifications: notificationsQuery.isFetching,
        loadError: categoriesQuery.error ? getMessage(categoriesQuery.error, "Unable to load categories.")
            : postsQuery.error ? getMessage(postsQuery.error, "Unable to load posts through the API Gateway.") : "",
        notificationError: notificationsQuery.error ? getMessage(notificationsQuery.error, "Unable to load Kafka-backed notifications.") : "",
        notifications,
        unreadNotifications: useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]),
        submittingPost: createPostMutation.isPending,
        submittingCommentId: createCommentMutation.isPending ? createCommentMutation.variables?.postId ?? null : null,
        savingPostId: updatePostMutation.isPending ? updatePostMutation.variables?.postId ?? null : null,
        deletingPostId: deletePostMutation.isPending ? deletePostMutation.variables ?? null : null,
        deletingCommentId: deleteCommentMutation.isPending ? deleteCommentMutation.variables?.commentId ?? null : null,
        handlePostChange, submitPost, submitSearch, clearSearch,
        changePage: (nextPage: number) => nextPage >= 0 && nextPage < pagination.totalPages && setPageNo(nextPage),
        savePost,
        removePost: async (postId: number) => { try { await deletePostMutation.mutateAsync(postId); return true; } catch { return false; } },
        loadComments,
        updateCommentDraft: (postId: number, value: string) => setCommentDrafts((current) => ({ ...current, [postId]: value })),
        submitComment,
        removeComment: async (postId: number, commentId: number) => { try { await deleteCommentMutation.mutateAsync({ postId, commentId }); return true; } catch { return false; } },
        markRead: (notificationId: number) => markReadMutation.mutate(notificationId),
        refreshNotifications: () => notificationsQuery.refetch(),
    };
};
