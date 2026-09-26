import { myAxios } from "./helper";

export const getCurrentUser = () => {
    return myAxios
        .get("/api/v1/auth/me")
        .then((response) => response.data);
};

export const getCategories = () => {
    return myAxios
        .get("/api/categories")
        .then((response) => response.data);
};

export const getPosts = ({ pageNo = 0, pageSize = 5 } = {}) => {
    return myAxios
        .get("/api/posts", {
            params: {
                pageNo,
                pageSize,
                sortBy: "addedDate",
                sortDir: "desc",
            },
        })
        .then((response) => response.data);
};

export const createPost = (post) => {
    return myAxios
        .post("/api/posts", post)
        .then((response) => response.data);
};

export const updatePost = (postId, post) => {
    return myAxios
        .put(`/api/post/${postId}`, post)
        .then((response) => response.data);
};

export const deletePost = (postId) => {
    return myAxios
        .delete(`/api/post/${postId}`)
        .then((response) => response.data);
};

export const searchPosts = (keywords) => {
    return myAxios
        .get(`/api/posts/search/${encodeURIComponent(keywords)}`)
        .then((response) => response.data);
};

export const getComments = (postId) => {
    return myAxios
        .get(`/api/posts/${postId}/comments`)
        .then((response) => response.data);
};

export const createComment = (postId, content) => {
    return myAxios
        .post(`/api/posts/${postId}/comments`, { content })
        .then((response) => response.data);
};

export const deleteComment = (commentId) => {
    return myAxios
        .delete(`/api/comments/${commentId}`)
        .then((response) => response.data);
};

export const getNotifications = () => {
    return myAxios
        .get("/api/notifications")
        .then((response) => response.data);
};

export const markNotificationRead = (notificationId) => {
    return myAxios
        .put(`/api/notifications/${notificationId}/read`)
        .then((response) => response.data);
};
