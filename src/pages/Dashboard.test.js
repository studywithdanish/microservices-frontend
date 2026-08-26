import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Dashboard from "./Dashboard";
import {
    createComment,
    createPost,
    getCategories,
    getComments,
    getCurrentUser,
    getPosts,
} from "../services/blog-service";

jest.mock("../services/blog-service", () => ({
    createComment: jest.fn(),
    createPost: jest.fn(),
    getCategories: jest.fn(),
    getComments: jest.fn(),
    getCurrentUser: jest.fn(),
    getPosts: jest.fn(),
}));

jest.mock("../services/auth-service", () => ({
    getTokenPreview: () => "token-preview",
    isLoggedIn: () => true,
    logout: jest.fn(),
}));

const category = {
    categoryId: 1,
    categoryTitle: "Engineering",
    categoryDescription: "Architecture",
};

const post = {
    postId: 10,
    title: "Existing post",
    content: "Existing content",
    authorId: 7,
    category,
};

beforeEach(() => {
    jest.clearAllMocks();
    getCurrentUser.mockResolvedValue({
        id: 7,
        name: "Danish",
        email: "danish@example.com",
        about: "Backend engineer",
    });
    getCategories.mockResolvedValue([category]);
    getPosts.mockResolvedValue({ content: [post] });
});

test("loads all service data and creates a post", async () => {
    const createdPost = {
        ...post,
        postId: 11,
        title: "Gateway integration",
        content: "Created from React",
    };
    createPost.mockResolvedValue(createdPost);

    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    expect(await screen.findByText("Welcome, Danish")).toBeInTheDocument();
    expect(screen.getByText("1 categories")).toBeInTheDocument();
    expect(screen.getByText("Existing post")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Title"), { target: { value: "Gateway integration" } });
    fireEvent.change(screen.getByLabelText("Content"), { target: { value: "Created from React" } });
    fireEvent.click(screen.getByRole("button", { name: "Create post" }));

    await waitFor(() => expect(createPost).toHaveBeenCalledWith({
        title: "Gateway integration",
        content: "Created from React",
        categoryId: 1,
    }));
    expect(await screen.findByText("Gateway integration")).toBeInTheDocument();
});

test("loads and creates comments for a post", async () => {
    getComments.mockResolvedValue([]);
    createComment.mockResolvedValue({
        id: 5,
        content: "Service boundary verified",
        postId: 10,
        authorId: 7,
    });

    render(
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Dashboard />
        </MemoryRouter>
    );

    await screen.findByText("Existing post");
    fireEvent.click(screen.getByRole("button", { name: "Load comments" }));

    const commentInput = await screen.findByLabelText("Add comment to Existing post");
    fireEvent.change(commentInput, { target: { value: "Service boundary verified" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => expect(createComment).toHaveBeenCalledWith(10, "Service boundary verified"));
    expect(await screen.findByText("Service boundary verified")).toBeInTheDocument();
});
