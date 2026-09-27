import type { ChangeEvent, FormEvent } from "react";
import type { Category, NewPost } from "../../types";

interface PostComposerProps {
    categories: Category[];
    newPost: NewPost;
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: (event: FormEvent) => void;
    submitting: boolean;
}

const PostComposer = ({
    categories,
    newPost,
    onChange,
    onSubmit,
    submitting,
}: PostComposerProps) => (
    <div className="card form-card sticky-form">
        <div className="card-header">
            <p className="eyebrow mb-2">Cross-service write</p>
            <h2>Create a post</h2>
        </div>
        <div className="card-body">
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="post-title">Title</label>
                    <input
                        className="form-control"
                        id="post-title"
                        name="title"
                        maxLength={100}
                        value={newPost.title}
                        onChange={onChange}
                        required
                    />
                    <small className="form-hint">{newPost.title.length}/100 characters</small>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="post-content">Content</label>
                    <textarea
                        className="form-control"
                        id="post-content"
                        name="content"
                        maxLength={10000}
                        value={newPost.content}
                        onChange={onChange}
                        required
                    />
                    <small className="form-hint">{newPost.content.length}/10000 characters</small>
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="post-category">Category</label>
                    <select
                        className="form-select"
                        id="post-category"
                        name="categoryId"
                        value={newPost.categoryId}
                        onChange={onChange}
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
                    disabled={submitting || !categories.length}
                >
                    {submitting ? "Creating..." : "Create post"}
                </button>
            </form>
        </div>
    </div>
);

export default PostComposer;
