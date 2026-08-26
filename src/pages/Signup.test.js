import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Signup from "./Signup";
import { signUp } from "../services/user-service";

jest.mock("../services/user-service", () => ({
    signUp: jest.fn(),
}));

test("enforces the backend password contract before registration", () => {
    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Signup />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Danish" } });
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "danish@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "short" } });
    fireEvent.change(screen.getByLabelText("About"), { target: { value: "Backend engineer" } });
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));

    expect(screen.getByText("Password must be 8 to 72 characters")).toBeInTheDocument();
    expect(signUp).not.toHaveBeenCalled();
});
