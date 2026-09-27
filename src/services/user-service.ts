import { myAxios } from "./helper";
import type { AuthResponse, LoginCredentials, RegistrationRequest, User } from "../types";

export const signUp = async (user: RegistrationRequest): Promise<User> =>
    (await myAxios.post<User>("/api/v1/auth/register", user)).data;

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> =>
    (await myAxios.post<AuthResponse>("/api/v1/auth/login", credentials)).data;

export const logout = async (): Promise<void> => {
    await myAxios.post("/api/v1/auth/logout");
};
