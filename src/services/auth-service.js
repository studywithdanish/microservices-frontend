const TOKEN_KEY = "authToken";
export const AUTH_STATE_CHANGED_EVENT = "auth-state-changed";

const notifyAuthStateChanged = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
    }
};

export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    notifyAuthStateChanged();
};

export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const isLoggedIn = () => {
    return Boolean(getToken());
};

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    notifyAuthStateChanged();
};

export const getTokenPreview = () => {
    const token = getToken();

    if (!token) {
        return "";
    }

    return `${token.slice(0, 18)}...${token.slice(-10)}`;
};
