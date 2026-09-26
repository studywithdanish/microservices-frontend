import axios from "axios";
import { getToken, logout } from "./auth-service";

export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || "http://localhost:9090").replace(/\/$/, "");

export const myAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

myAxios.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

myAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401 && getToken()) {
            logout();
        }

        return Promise.reject(error);
    }
);
