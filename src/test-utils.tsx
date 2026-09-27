import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext";

export const createTestQueryClient = () => new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 }, mutations: { retry: false } },
});

export const renderWithProviders = (
    ui: ReactElement,
    { route = "/", ...options }: RenderOptions & { route?: string } = {},
) => {
    const client = createTestQueryClient();
    const Wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={client}>
            <MemoryRouter initialEntries={[route]}>
                <AuthProvider>{children}</AuthProvider>
            </MemoryRouter>
        </QueryClientProvider>
    );
    return { queryClient: client, ...render(ui, { wrapper: Wrapper, ...options }) };
};
