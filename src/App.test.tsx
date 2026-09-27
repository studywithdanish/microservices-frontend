import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { createTestQueryClient } from "./test-utils";

vi.mock("./services/blog-service", () => ({
    getCurrentUser: vi.fn().mockRejectedValue(new Error("anonymous")),
}));

test("renders the home page heading", async () => {
    render(<QueryClientProvider client={createTestQueryClient()}><App /></QueryClientProvider>);
    expect(await screen.findByText(/blog platform client/i)).toBeInTheDocument();
});
