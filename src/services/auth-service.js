const TOKEN_KEY = "authToken";

export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const isLoggedIn = () => {
    return Boolean(getToken());
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getTokenPreview = () => {
    const token = getToken();

    if (!token) {
        return "";
    }

    return `${token.slice(0, 18)}...${token.slice(-10)}`;
};
