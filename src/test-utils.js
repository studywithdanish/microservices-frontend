import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthProvider } from "./context/AuthContext";

export const renderWithProviders = (ui, { route = "/" } = {}) => render(
    <MemoryRouter
        initialEntries={[route]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
        <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
);
