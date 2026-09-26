import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
    createComment,
    createPost,
    deleteComment,
    deletePost,
    getCategories,
    getComments,
    getCurrentUser,
    getNotifications,
    getPosts,
    markNotificationRead,
    searchPosts,
    updatePost,
} from "../../services/blog-service";

const PAGE_SIZE = 5;
const initialPost = { title: "", content: "", categoryId: "" };
const initialPagination = {
    pageNo: 0,
    pageSize: PAGE_SIZE,
    totalElement: 0,
    totalPages: 0,
    lastPage: true,
};

const getMessage = (error, fallback) => error?.response?.data?.message || fallback;

const normalizePosts = (response) => {
    if (Array.isArray(response)) {
        return {
            posts: response,
            pagination: {
                ...initialPagination,
                totalElement: response.length,
                totalPages: response.length ? 1 : 0,
            },
        };
    }

    const posts = Array.isArray(response?.content) ? response.content : [];
    return {
        posts,
        pagination: {
            pageNo: response?.pageNo ?? 0,
            pageSize: response?.pageSize ?? PAGE_SIZE,
            totalElement: response?.totalElement ?? posts.length,
            totalPages: response?.totalPages ?? (posts.length ? 1 : 0),
            lastPage: response?.lastPage ?? true,
        },
    };
};

export const useDashboard = () => {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const [currentUser, setCurrentUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState(initialPagination);
    const [newPost, setNewPost] = useState(initialPost);
    const [commentsByPost, setCommentsByPost] = useState({});
    const [commentDrafts, setCommentDrafts] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [pageNo, setPageNo] = useState(0);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const [submittingPost, setSubmittingPost] = useState(false);
    const [submittingCommentId, setSubmittingCommentId] = useState(null);
    const [savingPostId, setSavingPostId] = useState(null);
    const [deletingPostId, setDeletingPostId] = useState(null);
    const [deletingCommentId, setDeletingCommentId] = useState(null);
    const [loadError, setLoadError] = useState("");
    const [notificationError, setNotificationError] = useState("");

    const handleUnauthorized = useCallback((error) => {
        if (error?.response?.status !== 401 && error?.response?.status !== 403) {
            return false;
        }

        signOut();
        toast.error("Your session is no longer valid. Please log in again.");
        navigate("/login", { replace: true });
        return true;
    }, [navigate, signOut]);

    const loadPosts = useCallback(async ({ page = pageNo, search = activeSearch } = {}) => {
        setLoadingPosts(true);
        setLoadError("");

        try {
            const response = search
                ? await searchPosts(search)
                : await getPosts({ pageNo: page, pageSize: PAGE_SIZE });
            const normalized = normalizePosts(response);
            setPosts(normalized.posts);
            setPagination(normalized.pagination);
        } catch (error) {
            if (!handleUnauthorized(error)) {
                setLoadError(getMessage(error, "Unable to load posts through the API Gateway."));
            }
        } finally {
            setLoadingPosts(false);
        }
    }, [activeSearch, handleUnauthorized, pageNo]);

    const refreshNotifications = useCallback(async () => {
        setLoadingNotifications(true);
        setNotificationError("");

        try {
            const response = await getNotifications();
            setNotifications(Array.isArray(response) ? response : []);
        } catch (error) {
            if (!handleUnauthorized(error)) {
                setNotificationError(getMessage(error, "Unable to load Kafka-backed notifications."));
            }
        } finally {
            setLoadingNotifications(false);
        }
    }, [handleUnauthorized]);

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            setLoadingProfile(true);
            try {
                const [userResponse, categoryResponse] = await Promise.all([
                    getCurrentUser(),
                    getCategories(),
                ]);

                if (!active) {
                    return;
                }

                const loadedCategories = Array.isArray(categoryResponse) ? categoryResponse : [];
                setCurrentUser(userResponse);
                setCategories(loadedCategories);
                setNewPost((current) => ({
                    ...current,
                    categoryId: current.categoryId || String(loadedCategories[0]?.categoryId || ""),
                }));
            } catch (error) {
                if (active && !handleUnauthorized(error)) {
                    setLoadError(getMessage(error, "Unable to load your profile and categories."));
                }
            } finally {
                if (active) {
                    setLoadingProfile(false);
                }
            }
        };

        loadProfile();
        return () => {
            active = false;
        };
    }, [handleUnauthorized]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    useEffect(() => {
        refreshNotifications();
    }, [refreshNotifications]);

    const submitSearch = (event) => {
        event.preventDefault();
        const nextSearch = searchInput.trim();
        setPageNo(0);

        if (nextSearch === activeSearch) {
            loadPosts({ page: 0, search: nextSearch });
            return;
        }

        setActiveSearch(nextSearch);
    };

    const clearSearch = () => {
        setSearchInput("");
        setPageNo(0);

        if (!activeSearch) {
            loadPosts({ page: 0, search: "" });
            return;
        }

        setActiveSearch("");
    };

    const changePage = (nextPage) => {
        if (nextPage >= 0 && nextPage < pagination.totalPages) {
            setPageNo(nextPage);
        }
    };

    const handlePostChange = (event) => {
        const { name, value } = event.target;
        setNewPost((current) => ({ ...current, [name]: value }));
    };

    const submitPost = async (event) => {
        event.preventDefault();

        if (!newPost.title.trim() || !newPost.content.trim() || !newPost.categoryId) {
            toast.error("Title, content, and category are required.");
            return;
        }

        setSubmittingPost(true);
        try {
            await createPost({
                title: newPost.title.trim(),
                content: newPost.content.trim(),
                categoryId: Number(newPost.categoryId),
            });
            setNewPost((current) => ({ ...initialPost, categoryId: current.categoryId }));
            setSearchInput("");
            setActiveSearch("");
            setPageNo(0);
            await loadPosts({ page: 0, search: "" });
            toast.success("Post created. Refresh notifications to see the Kafka event result.");
        } catch (error) {
            if (!handleUnauthorized(error)) {
                toast.error(getMessage(error, "Unable to create the post."));
            }
        } finally {
            setSubmittingPost(false);
        }
    };

    const savePost = async (postId, draft) => {
        const title = draft.title.trim();
        const content = draft.content.trim();

        if (!title || !content) {
            toast.error("Title and content are required.");
            return false;
        }

        setSavingPostId(postId);
        try {
            const saved = await updatePost(postId, { title, content });
            setPosts((current) => current.map((post) => (post.postId === postId ? saved : post)));
            toast.success("Post updated successfully.");
            return true;
        } catch (error) {
            if (!handleUnauthorized(error)) {
                toast.error(getMessage(error, "Unable to update the post."));
            }
            return false;
        } finally {
            setSavingPostId(null);
        }
    };

    const removePost = async (postId) => {
        setDeletingPostId(postId);
        try {
            await deletePost(postId);
            setCommentsByPost((current) => {
                const next = { ...current };
                delete next[postId];
                return next;
            });

            if (posts.length === 1 && pageNo > 0 && !activeSearch) {
                setPageNo((current) => current - 1);
            } else {
                await loadPosts({ page: pageNo, search: activeSearch });
            }
            toast.success("Post deleted successfully.");
            return true;
        } catch (error) {
            if (!handleUnauthorized(error)) {
                toast.error(getMessage(error, "Unable to delete the post."));
            }
            return false;
        } finally {
            setDeletingPostId(null);
        }
    };

    const loadComments = async (postId) => {
        if (Object.prototype.hasOwnProperty.call(commentsByPost, postId)) {
            setCommentsByPost((current) => {
                const next = { ...current };
                delete next[postId];
                return next;
            });
            return;
        }

        try {
            const comments = await getComments(postId);
            setCommentsByPost((current) => ({
                ...current,
                [postId]: Array.isArray(comments) ? comments : [],
            }));
        } catch (error) {
            toast.error(getMessage(error, "Unable to load comments."));
        }
    };

    const updateCommentDraft = (postId, value) => {
        setCommentDrafts((current) => ({ ...current, [postId]: value }));
    };

    const submitComment = async (event, postId) => {
        event.preventDefault();
        const content = commentDrafts[postId]?.trim();

        if (!content) {
            toast.error("Comment content is required.");
            return;
        }

        setSubmittingCommentId(postId);
        try {
            const created = await createComment(postId, content);
            setCommentsByPost((current) => ({
                ...current,
                [postId]: [...(current[postId] || []), created],
            }));
            updateCommentDraft(postId, "");
            toast.success("Comment created through the Content Service.");
        } catch (error) {
            if (!handleUnauthorized(error)) {
                toast.error(getMessage(error, "Unable to create the comment."));
            }
        } finally {
            setSubmittingCommentId(null);
        }
    };

    const removeComment = async (postId, commentId) => {
        setDeletingCommentId(commentId);
        try {
            await deleteComment(commentId);
            setCommentsByPost((current) => ({
                ...current,
                [postId]: (current[postId] || []).filter((comment) => comment.id !== commentId),
            }));
            toast.success("Comment deleted successfully.");
        } catch (error) {
            if (!handleUnauthorized(error)) {
                toast.error(getMessage(error, "Unable to delete the comment."));
            }
        } finally {
            setDeletingCommentId(null);
        }
    };

    const markRead = async (notificationId) => {
        try {
            const updated = await markNotificationRead(notificationId);
            setNotifications((current) => current.map((notification) => (
                notification.id === notificationId ? updated : notification
            )));
        } catch (error) {
            if (!handleUnauthorized(error)) {
                toast.error(getMessage(error, "Unable to mark the notification as read."));
            }
        }
    };

    const unreadNotifications = useMemo(
        () => notifications.filter((notification) => !notification.read).length,
        [notifications]
    );

    return {
        activeSearch,
        categories,
        changePage,
        clearSearch,
        commentDrafts,
        commentsByPost,
        currentUser,
        deletingCommentId,
        deletingPostId,
        handlePostChange,
        loadComments,
        loadError,
        loading: loadingProfile || loadingPosts,
        loadingNotifications,
        markRead,
        newPost,
        notificationError,
        notifications,
        pageNo,
        pagination,
        posts,
        refreshNotifications,
        removeComment,
        removePost,
        savePost,
        savingPostId,
        searchInput,
        setSearchInput,
        submitComment,
        submitPost,
        submitSearch,
        submittingCommentId,
        submittingPost,
        unreadNotifications,
        updateCommentDraft,
    };
};
