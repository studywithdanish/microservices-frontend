import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
    AUTH_STATE_CHANGED_EVENT,
    getToken,
    isLoggedIn,
    logout as clearSession,
    saveToken,
} from "../services/auth-service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(getToken);
    const authenticated = Boolean(token);

    const syncAuthentication = useCallback(() => {
        setToken(isLoggedIn() ? getToken() : null);
    }, []);

    useEffect(() => {
        window.addEventListener("storage", syncAuthentication);
        window.addEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthentication);

        return () => {
            window.removeEventListener("storage", syncAuthentication);
            window.removeEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthentication);
        };
    }, [syncAuthentication]);

    const signIn = useCallback((token) => {
        saveToken(token);
        setToken(token);
    }, []);

    const signOut = useCallback(() => {
        clearSession();
        setToken(null);
    }, []);

    const value = useMemo(() => ({
        authenticated,
        token,
        signIn,
        signOut,
    }), [authenticated, signIn, signOut, token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
