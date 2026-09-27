import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import { getCurrentUser } from "../services/blog-service";
import { logout } from "../services/user-service";
import { createTestQueryClient } from "../test-utils";

vi.mock("../services/blog-service", () => ({ getCurrentUser: vi.fn() }));
vi.mock("../services/user-service", () => ({ logout: vi.fn() }));

const SessionView = () => {
    const { authenticated, checking, signOut, user } = useAuth();
    if (checking) return <span>Checking</span>;
    return (
        <div>
            <span>{authenticated ? user?.email : "Anonymous"}</span>
            {authenticated && <button type="button" onClick={() => void signOut()}>Sign out</button>}
        </div>
    );
};

test("restores and clears an HttpOnly-backed server session", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({
        id: 7, name: "Danish", email: "danish@example.com", about: "Engineer", roles: [],
    });
    vi.mocked(logout).mockResolvedValue();

    render(
        <QueryClientProvider client={createTestQueryClient()}>
            <AuthProvider><SessionView /></AuthProvider>
        </QueryClientProvider>,
    );

    expect(await screen.findByText("danish@example.com")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    await waitFor(() => expect(logout).toHaveBeenCalledOnce());
    expect(await screen.findByText("Anonymous")).toBeInTheDocument();
});
