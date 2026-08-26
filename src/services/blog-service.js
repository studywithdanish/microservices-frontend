import { getToken } from "./auth-service";
import { myAxios } from "./helper";

const authorizedConfig = () => ({
    headers: {
        Authorization: `Bearer ${getToken()}`,
    },
});

export const getCurrentUser = () => {
    return myAxios
        .get("/api/v1/auth/me", authorizedConfig())
        .then((response) => response.data);
};

export const getCategories = () => {
    return myAxios
        .get("/api/categories")
        .then((response) => response.data);
};

export const getPosts = () => {
    return myAxios
        .get("/api/posts", {
            params: {
                pageNo: 0,
                pageSize: 20,
                sortBy: "addedDate",
                sortDir: "desc",
            },
        })
        .then((response) => response.data);
};

export const createPost = (post) => {
    return myAxios
        .post("/api/posts", post, authorizedConfig())
        .then((response) => response.data);
};

export const getComments = (postId) => {
    return myAxios
        .get(`/api/posts/${postId}/comments`)
        .then((response) => response.data);
};

export const createComment = (postId, content) => {
    return myAxios
        .post(`/api/posts/${postId}/comments`, { content }, authorizedConfig())
        .then((response) => response.data);
};
