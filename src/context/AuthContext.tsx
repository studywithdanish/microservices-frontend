import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "../services/blog-service";
import { SESSION_EXPIRED_EVENT } from "../services/auth-service";
import { logout as logoutRequest } from "../services/user-service";
import type { User } from "../types";

interface AuthContextValue {
    authenticated: boolean;
    checking: boolean;
    user: User | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
export const SESSION_QUERY_KEY = ["session"] as const;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const client = useQueryClient();
    const session = useQuery({
        queryKey: SESSION_QUERY_KEY,
        queryFn: getCurrentUser,
    });

    const clearSession = useCallback(() => {
        client.setQueryData(SESSION_QUERY_KEY, null);
    }, [client]);

    useEffect(() => {
        window.addEventListener(SESSION_EXPIRED_EVENT, clearSession);
        return () => window.removeEventListener(SESSION_EXPIRED_EVENT, clearSession);
    }, [clearSession]);

    const signIn = useCallback(async () => {
        await client.fetchQuery({ queryKey: SESSION_QUERY_KEY, queryFn: getCurrentUser, staleTime: 0 });
    }, [client]);

    const signOut = useCallback(async () => {
        try {
            await logoutRequest();
        } finally {
            clearSession();
            client.removeQueries({ queryKey: ["dashboard"] });
        }
    }, [clearSession, client]);

    const user = session.data ?? null;
    const value = useMemo<AuthContextValue>(() => ({
        authenticated: Boolean(user),
        checking: session.isPending,
        user,
        signIn,
        signOut,
    }), [session.isPending, signIn, signOut, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
