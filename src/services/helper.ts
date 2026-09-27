import axios from "axios";
import { notifySessionExpired } from "./auth-service";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:9090").replace(/\/$/, "");

export const myAxios = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

myAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            notifySessionExpired();
        }
        return Promise.reject(error);
    },
);
