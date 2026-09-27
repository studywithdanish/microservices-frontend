import { fireEvent, screen } from "@testing-library/react";
import Signup from "./Signup";
import { signUp } from "../services/user-service";
import { getCurrentUser } from "../services/blog-service";
import { renderWithProviders } from "../test-utils";

vi.mock("../services/user-service", () => ({ signUp: vi.fn() }));
vi.mock("../services/blog-service", () => ({ getCurrentUser: vi.fn() }));

test("enforces the backend password contract before registration", async () => {
    vi.mocked(getCurrentUser).mockRejectedValue(new Error("anonymous"));
    renderWithProviders(<Signup />);

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Danish" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "danish@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "short" } });
    fireEvent.change(screen.getByLabelText("About"), { target: { value: "Backend engineer" } });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("Password must be 8 to 72 characters")).toBeInTheDocument();
    expect(vi.mocked(signUp)).not.toHaveBeenCalled();
});
