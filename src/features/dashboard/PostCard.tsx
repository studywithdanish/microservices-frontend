import { useEffect, useState, type FormEvent } from "react";
import type { Comment, Post, PostDraft, User } from "../../types";

interface PostCardProps {
    commentDraft?: string;
    comments?: Comment[];
    currentUser: User | null;
    deletingCommentId: number | null;
    deletingPost: boolean;
    loadingComments: boolean;
    onCommentDraftChange: (postId: number, value: string) => void;
    onDeleteComment: (postId: number, commentId: number) => Promise<boolean>;
    onDeletePost: (postId: number) => Promise<boolean>;
    onSavePost: (postId: number, draft: PostDraft) => Promise<boolean>;
    onSubmitComment: (event: FormEvent, postId: number) => void;
    onToggleComments: (postId: number) => Promise<void>;
    post: Post;
    savingPost: boolean;
    submittingComment: boolean;
}

const formatDate = (value?: string) => {
    if (!value) {
        return "Date unavailable";
    }

    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
};

const PostCard = ({
    commentDraft,
    comments,
    currentUser,
    deletingCommentId,
    deletingPost,
    loadingComments,
    onCommentDraftChange,
    onDeleteComment,
    onDeletePost,
    onSavePost,
    onSubmitComment,
    onToggleComments,
    post,
    savingPost,
    submittingComment,
}: PostCardProps) => {
    const [editing, setEditing] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [draft, setDraft] = useState({ title: post.title, content: post.content });
    const roleNames = (currentUser?.roles || []).map((role) => role.name);
    const isAdmin = roleNames.includes("ROLE_ADMIN");
    const canManagePost = isAdmin || Number(currentUser?.id) === Number(post.authorId);

    useEffect(() => {
        setDraft({ title: post.title, content: post.content });
    }, [post.content, post.title]);

    const save = async (event: FormEvent) => {
        event.preventDefault();
        const saved = await onSavePost(post.postId, draft);
        if (saved) {
            setEditing(false);
        }
    };

    const remove = async () => {
        const deleted = await onDeletePost(post.postId);
        if (!deleted) {
            setConfirmingDelete(false);
        }
    };

    return (
        <article className="post-card">
            <div className="post-meta">
                <span>{post.category?.categoryTitle || "Uncategorised"}</span>
                <span>{formatDate(post.addedDate)} · Author #{post.authorId}</span>
            </div>

            {editing ? (
                <form className="edit-post-form" onSubmit={save}>
                    <div>
                        <label className="form-label" htmlFor={`edit-title-${post.postId}`}>Edit title</label>
                        <input
                            className="form-control"
                            id={`edit-title-${post.postId}`}
                            maxLength={100}
                            value={draft.title}
                            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label" htmlFor={`edit-content-${post.postId}`}>Edit content</label>
                        <textarea
                            className="form-control"
                            id={`edit-content-${post.postId}`}
                            maxLength={10000}
                            value={draft.content}
                            onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
                            required
                        />
                    </div>
                    <div className="post-actions">
                        <button className="btn btn-sm btn-primary" type="submit" disabled={savingPost}>
                            {savingPost ? "Saving..." : "Save changes"}
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            type="button"
                            onClick={() => {
                                setDraft({ title: post.title, content: post.content });
                                setEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                </>
            )}

            {!editing && (
                <div className="post-actions">
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        type="button"
                        onClick={() => onToggleComments(post.postId)}
                        disabled={loadingComments}
                    >
                        {loadingComments ? "Loading..." : comments ? "Hide comments" : "Load comments"}
                    </button>
                    {canManagePost && (
                        <>
                            <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => setEditing(true)}>
                                Edit
                            </button>
                            {!confirmingDelete ? (
                                <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => setConfirmingDelete(true)}>
                                    Delete
                                </button>
                            ) : (
                                <span className="delete-confirmation">
                                    <span>Delete permanently?</span>
                                    <button className="btn btn-sm btn-danger" type="button" onClick={remove} disabled={deletingPost}>
                                        {deletingPost ? "Deleting..." : "Confirm"}
                                    </button>
                                    <button className="btn btn-sm btn-link" type="button" onClick={() => setConfirmingDelete(false)}>
                                        Cancel
                                    </button>
                                </span>
                            )}
                        </>
                    )}
                </div>
            )}

            {comments && (
                <div className="comment-panel">
                    {comments.length === 0 && <p className="text-muted">No comments yet.</p>}
                    {comments.map((comment) => {
                        const canDeleteComment = isAdmin || Number(currentUser?.id) === Number(comment.authorId);
                        return (
                            <div className="comment-item" key={comment.id}>
                                <span>{comment.content}</span>
                                <div className="comment-owner-actions">
                                    <small>Author #{comment.authorId}</small>
                                    {canDeleteComment && (
                                        <button
                                            className="btn btn-sm btn-link text-danger"
                                            type="button"
                                            onClick={() => onDeleteComment(post.postId, comment.id)}
                                            disabled={deletingCommentId === comment.id}
                                            aria-label={`Delete comment ${comment.id}`}
                                        >
                                            {deletingCommentId === comment.id ? "Deleting..." : "Delete"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <form className="comment-form" onSubmit={(event) => onSubmitComment(event, post.postId)}>
                        <label className="visually-hidden" htmlFor={`comment-${post.postId}`}>
                            Add comment to {post.title}
                        </label>
                        <input
                            className="form-control"
                            id={`comment-${post.postId}`}
                            maxLength={255}
                            placeholder="Add a comment"
                            value={commentDraft || ""}
                            onChange={(event) => onCommentDraftChange(post.postId, event.target.value)}
                        />
                        <button className="btn btn-primary" type="submit" disabled={submittingComment}>
                            {submittingComment ? "Adding..." : "Add"}
                        </button>
                    </form>
                </div>
            )}
        </article>
    );
};

export default PostCard;
