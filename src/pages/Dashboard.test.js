import { fireEvent, screen, waitFor } from "@testing-library/react";
import Dashboard from "./Dashboard";
import {
    createComment,
    createPost,
    deleteComment,
    deletePost,
    getCategories,
    getComments,
    getCurrentUser,
    getNotifications,
    getPosts,
    markNotificationRead,
    searchPosts,
    updatePost,
} from "../services/blog-service";
import { renderWithProviders } from "../test-utils";

jest.mock("../services/blog-service", () => ({
    createComment: jest.fn(),
    createPost: jest.fn(),
    deleteComment: jest.fn(),
    deletePost: jest.fn(),
    getCategories: jest.fn(),
    getComments: jest.fn(),
    getCurrentUser: jest.fn(),
    getNotifications: jest.fn(),
    getPosts: jest.fn(),
    markNotificationRead: jest.fn(),
    searchPosts: jest.fn(),
    updatePost: jest.fn(),
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
    localStorage.setItem("authToken", "test-token");
    getCurrentUser.mockResolvedValue({
        id: 7,
        name: "Danish",
        email: "danish@example.com",
        about: "Backend engineer",
        roles: [{ id: 1, name: "ROLE_NORMAL" }],
    });
    getCategories.mockResolvedValue([category]);
    getPosts.mockResolvedValue({
        content: [post],
        pageNo: 0,
        pageSize: 5,
        totalElement: 1,
        totalPages: 1,
        lastPage: true,
    });
    getNotifications.mockResolvedValue([]);
});

test("loads all service data and creates a post", async () => {
    const createdPost = {
        ...post,
        postId: 11,
        title: "Gateway integration",
        content: "Created from React",
    };
    createPost.mockResolvedValue(createdPost);
    getPosts
        .mockResolvedValueOnce({
            content: [post],
            pageNo: 0,
            pageSize: 5,
            totalElement: 1,
            totalPages: 1,
            lastPage: true,
        })
        .mockResolvedValueOnce({
            content: [createdPost, post],
            pageNo: 0,
            pageSize: 5,
            totalElement: 2,
            totalPages: 1,
            lastPage: true,
        });

    renderWithProviders(<Dashboard />, { route: "/dashboard" });

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

    renderWithProviders(<Dashboard />, { route: "/dashboard" });

    await screen.findByText("Existing post");
    fireEvent.click(screen.getByRole("button", { name: "Load comments" }));

    const commentInput = await screen.findByLabelText("Add comment to Existing post");
    fireEvent.change(commentInput, { target: { value: "Service boundary verified" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => expect(createComment).toHaveBeenCalledWith(10, "Service boundary verified"));
    expect(await screen.findByText("Service boundary verified")).toBeInTheDocument();
});

test("searches posts and updates an owned post", async () => {
    const searchResult = { ...post, title: "Kafka architecture" };
    searchPosts.mockResolvedValue([searchResult]);
    updatePost.mockResolvedValue({ ...searchResult, title: "Kafka and outbox architecture" });

    renderWithProviders(<Dashboard />, { route: "/dashboard" });
    await screen.findByText("Existing post");

    fireEvent.change(screen.getByRole("searchbox", { name: "Search posts" }), {
        target: { value: "Kafka" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(await screen.findByText("Kafka architecture")).toBeInTheDocument();
    expect(searchPosts).toHaveBeenCalledWith("Kafka");

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.change(screen.getByLabelText("Edit title"), {
        target: { value: "Kafka and outbox architecture" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await waitFor(() => expect(updatePost).toHaveBeenCalledWith(10, {
        title: "Kafka and outbox architecture",
        content: "Existing content",
    }));
    expect(await screen.findByText("Kafka and outbox architecture")).toBeInTheDocument();
});

test("shows Kafka notifications and marks one as read", async () => {
    const notification = {
        id: 99,
        type: "POST_PUBLISHED",
        title: "Post published",
        message: "Existing post was published.",
        postId: 10,
        read: false,
        createdAt: "2026-09-18T04:00:00Z",
    };
    getNotifications.mockResolvedValue([notification]);
    markNotificationRead.mockResolvedValue({ ...notification, read: true });

    renderWithProviders(<Dashboard />, { route: "/dashboard" });

    expect(await screen.findByText("Post published")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mark as read" }));

    await waitFor(() => expect(markNotificationRead).toHaveBeenCalledWith(99));
    expect(screen.queryByRole("button", { name: "Mark as read" })).not.toBeInTheDocument();
});

test("requires confirmation before deleting an owned post", async () => {
    deletePost.mockResolvedValue({ message: "Post deleted successfully", success: true });
    getPosts
        .mockResolvedValueOnce({
            content: [post],
            pageNo: 0,
            pageSize: 5,
            totalElement: 1,
            totalPages: 1,
            lastPage: true,
        })
        .mockResolvedValueOnce({
            content: [],
            pageNo: 0,
            pageSize: 5,
            totalElement: 0,
            totalPages: 0,
            lastPage: true,
        });

    renderWithProviders(<Dashboard />, { route: "/dashboard" });
    await screen.findByText("Existing post");

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("Delete permanently?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));

    await waitFor(() => expect(deletePost).toHaveBeenCalledWith(10));
    await waitFor(() => expect(screen.queryByText("Existing post")).not.toBeInTheDocument());
});

test("deletes a comment owned by the signed-in user", async () => {
    getComments.mockResolvedValue([{
        id: 5,
        content: "Remove this comment",
        postId: 10,
        authorId: 7,
    }]);
    deleteComment.mockResolvedValue({ message: "Comment deleted successfully", success: true });

    renderWithProviders(<Dashboard />, { route: "/dashboard" });
    await screen.findByText("Existing post");
    fireEvent.click(screen.getByRole("button", { name: "Load comments" }));
    await screen.findByText("Remove this comment");
    fireEvent.click(screen.getByRole("button", { name: "Delete comment 5" }));

    await waitFor(() => expect(deleteComment).toHaveBeenCalledWith(5));
    await waitFor(() => expect(screen.queryByText("Remove this comment")).not.toBeInTheDocument());
});
