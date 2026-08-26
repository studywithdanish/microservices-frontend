import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Base from "../components/Base";
import { getTokenPreview, logout } from "../services/auth-service";
import {
    createComment,
    createPost,
    getCategories,
    getComments,
    getCurrentUser,
    getPosts,
} from "../services/blog-service";
import { API_BASE_URL } from "../services/helper";

const initialPost = {
    title: "",
    content: "",
    categoryId: "",
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState(initialPost);
    const [commentsByPost, setCommentsByPost] = useState({});
    const [commentDrafts, setCommentDrafts] = useState({});
    const [loading, setLoading] = useState(true);
    const [submittingPost, setSubmittingPost] = useState(false);
    const [submittingCommentId, setSubmittingCommentId] = useState(null);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            try {
                const [userResponse, categoryResponse, postResponse] = await Promise.all([
                    getCurrentUser(),
                    getCategories(),
                    getPosts(),
                ]);

                if (!active) {
                    return;
                }

                const loadedCategories = Array.isArray(categoryResponse) ? categoryResponse : [];
                setCurrentUser(userResponse);
                setCategories(loadedCategories);
                setPosts(Array.isArray(postResponse?.content) ? postResponse.content : []);
                setNewPost((current) => ({
                    ...current,
                    categoryId: current.categoryId || String(loadedCategories[0]?.categoryId || ""),
                }));
            } catch (error) {
                if (!active) {
                    return;
                }

                if (error?.response?.status === 401 || error?.response?.status === 403) {
                    logout();
                    toast.error("Your session is no longer valid. Please log in again.");
                    navigate("/login", { replace: true });
                    return;
                }

                setLoadError("The gateway could not load the complete service view. Confirm the Docker stack is healthy.");
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadDashboard();

        return () => {
            active = false;
        };
    }, [navigate]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handlePostChange = (event) => {
        const { name, value } = event.target;
        setNewPost((current) => ({ ...current, [name]: value }));
    };

    const submitPost = async (event) => {
        event.preventDefault();

        if (!newPost.title.trim() || !newPost.content.trim() || !newPost.categoryId) {
            toast.error("Title, content, and category are required.");
            return;
        }

        setSubmittingPost(true);
        try {
            const created = await createPost({
                title: newPost.title.trim(),
                content: newPost.content.trim(),
                categoryId: Number(newPost.categoryId),
            });
            setPosts((current) => [created, ...current]);
            setNewPost((current) => ({ ...initialPost, categoryId: current.categoryId }));
            toast.success("Post created through the API Gateway.");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to create the post.");
        } finally {
            setSubmittingPost(false);
        }
    };

    const loadComments = async (postId) => {
        if (commentsByPost[postId]) {
            setCommentsByPost((current) => {
                const next = { ...current };
                delete next[postId];
                return next;
            });
            return;
        }

        try {
            const comments = await getComments(postId);
            setCommentsByPost((current) => ({ ...current, [postId]: comments }));
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to load comments.");
        }
    };

    const submitComment = async (event, postId) => {
        event.preventDefault();
        const content = commentDrafts[postId]?.trim();

        if (!content) {
            toast.error("Comment content is required.");
            return;
        }

        setSubmittingCommentId(postId);
        try {
            const created = await createComment(postId, content);
            setCommentsByPost((current) => ({
                ...current,
                [postId]: [...(current[postId] || []), created],
            }));
            setCommentDrafts((current) => ({ ...current, [postId]: "" }));
            toast.success("Comment created through the Content Service.");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Unable to create the comment.");
        } finally {
            setSubmittingCommentId(null);
        }
    };

    return (
        <Base>
            <section className="content-section">
                <div className="container">
                    <div className="section-heading dashboard-heading">
                        <div>
                            <p className="eyebrow">Authenticated microservices workspace</p>
                            <h1>Welcome{currentUser?.name ? `, ${currentUser.name}` : ""}</h1>
                            <p>
                                This page exercises Identity, Post, and Content services through one public gateway.
                            </p>
                        </div>
                        <button className="btn btn-outline-danger" type="button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                    {loading && <div className="alert alert-info">Loading service data...</div>}
                    {loadError && <div className="alert alert-warning">{loadError}</div>}

                    <div className="dashboard-grid mb-4">
                        <div className="feature-card">
                            <span className="status-pill">Identity Service</span>
                            <h3 className="mt-3">{currentUser?.email || "Authenticated session"}</h3>
                            <p>{currentUser?.about || "JWT verified through the gateway."}</p>
                        </div>
                        <div className="feature-card">
                            <span className="status-pill">Content Service</span>
                            <h3 className="mt-3">{categories.length} categories</h3>
                            <p>Category data comes from its independently owned database.</p>
                        </div>
                        <div className="feature-card">
                            <span className="status-pill">Post Service</span>
                            <h3 className="mt-3">{posts.length} recent posts</h3>
                            <p>Post records include category snapshots and scalar author identifiers.</p>
                        </div>
                    </div>

                    <div className="row g-4 align-items-start">
                        <div className="col-lg-4">
                            <div className="card form-card sticky-form">
                                <div className="card-header">
                                    <p className="eyebrow mb-2">Cross-service write</p>
                                    <h2>Create a post</h2>
                                </div>
                                <div className="card-body">
                                    <form onSubmit={submitPost}>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="post-title">Title</label>
                                            <input
                                                className="form-control"
                                                id="post-title"
                                                name="title"
                                                maxLength="100"
                                                value={newPost.title}
                                                onChange={handlePostChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="post-content">Content</label>
                                            <textarea
                                                className="form-control"
                                                id="post-content"
                                                name="content"
                                                maxLength="10000"
                                                value={newPost.content}
                                                onChange={handlePostChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" htmlFor="post-category">Category</label>
                                            <select
                                                className="form-select"
                                                id="post-category"
                                                name="categoryId"
                                                value={newPost.categoryId}
                                                onChange={handlePostChange}
                                                disabled={!categories.length}
                                                required
                                            >
                                                {!categories.length && <option value="">No categories available</option>}
                                                {categories.map((category) => (
                                                    <option key={category.categoryId} value={category.categoryId}>
                                                        {category.categoryTitle}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            className="btn btn-primary w-100"
                                            type="submit"
                                            disabled={submittingPost || !categories.length}
                                        >
                                            {submittingPost ? "Creating..." : "Create post"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-8">
                            <div className="d-flex justify-content-between align-items-center mb-3 gap-3 flex-wrap">
                                <h2 className="mb-0">Recent posts</h2>
                                <span className="text-muted">Gateway: {API_BASE_URL}</span>
                            </div>

                            {!loading && !posts.length && (
                                <div className="empty-state">No posts yet. Create the first post from this dashboard.</div>
                            )}

                            <div className="post-list">
                                {posts.map((post) => (
                                    <article className="post-card" key={post.postId}>
                                        <div className="post-meta">
                                            <span>{post.category?.categoryTitle || "Uncategorised"}</span>
                                            <span>Author #{post.authorId}</span>
                                        </div>
                                        <h3>{post.title}</h3>
                                        <p>{post.content}</p>
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            type="button"
                                            onClick={() => loadComments(post.postId)}
                                        >
                                            {commentsByPost[post.postId] ? "Hide comments" : "Load comments"}
                                        </button>

                                        {commentsByPost[post.postId] && (
                                            <div className="comment-panel">
                                                {commentsByPost[post.postId].length === 0 && (
                                                    <p className="text-muted">No comments yet.</p>
                                                )}
                                                {commentsByPost[post.postId].map((comment) => (
                                                    <div className="comment-item" key={comment.id}>
                                                        <span>{comment.content}</span>
                                                        <small>Author #{comment.authorId}</small>
                                                    </div>
                                                ))}
                                                <form className="comment-form" onSubmit={(event) => submitComment(event, post.postId)}>
                                                    <label className="visually-hidden" htmlFor={`comment-${post.postId}`}>
                                                        Add comment to {post.title}
                                                    </label>
                                                    <input
                                                        className="form-control"
                                                        id={`comment-${post.postId}`}
                                                        maxLength="255"
                                                        placeholder="Add a comment"
                                                        value={commentDrafts[post.postId] || ""}
                                                        onChange={(event) => setCommentDrafts((current) => ({
                                                            ...current,
                                                            [post.postId]: event.target.value,
                                                        }))}
                                                    />
                                                    <button
                                                        className="btn btn-primary"
                                                        type="submit"
                                                        disabled={submittingCommentId === post.postId}
                                                    >
                                                        {submittingCommentId === post.postId ? "Adding..." : "Add"}
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>

                    <details className="session-details">
                        <summary>Session and operational links</summary>
                        <div className="dashboard-actions">
                            <span className="api-url">Token: {getTokenPreview()}</span>
                            <a className="btn btn-outline-secondary" href={`${API_BASE_URL}/actuator/health`} target="_blank" rel="noreferrer">
                                Gateway health
                            </a>
                        </div>
                    </details>
                </div>
            </section>
        </Base>
    );
};

export default Dashboard;
