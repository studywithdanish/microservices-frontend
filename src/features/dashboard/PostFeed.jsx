import { useState } from "react";
import PostCard from "./PostCard";

const PostFeed = ({
    activeSearch,
    commentDrafts,
    commentsByPost,
    currentUser,
    deletingCommentId,
    deletingPostId,
    loading,
    onChangePage,
    onClearSearch,
    onCommentDraftChange,
    onDeleteComment,
    onDeletePost,
    onSavePost,
    onSearch,
    onSearchInputChange,
    onSubmitComment,
    onToggleComments,
    pageNo,
    pagination,
    posts,
    savingPostId,
    searchInput,
    submittingCommentId,
}) => {
    const [loadingCommentPostId, setLoadingCommentPostId] = useState(null);

    const toggleComments = async (postId) => {
        setLoadingCommentPostId(postId);
        try {
            await onToggleComments(postId);
        } finally {
            setLoadingCommentPostId(null);
        }
    };

    return (
        <section aria-labelledby="post-feed-heading">
            <div className="post-feed-header">
                <div>
                    <h2 id="post-feed-heading" className="mb-1">Recent posts</h2>
                    <p className="text-muted mb-0">
                        {activeSearch ? `Search results for “${activeSearch}”` : `${pagination.totalElement} total posts`}
                    </p>
                </div>
                <form className="post-search" role="search" onSubmit={onSearch}>
                    <label className="visually-hidden" htmlFor="post-search">Search posts</label>
                    <input
                        className="form-control"
                        id="post-search"
                        type="search"
                        placeholder="Search by title or content"
                        value={searchInput}
                        onChange={(event) => onSearchInputChange(event.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">Search</button>
                    {(activeSearch || searchInput) && (
                        <button className="btn btn-outline-secondary" type="button" onClick={onClearSearch}>Clear</button>
                    )}
                </form>
            </div>

            {loading && <div className="alert alert-info">Loading posts...</div>}
            {!loading && !posts.length && (
                <div className="empty-state">
                    {activeSearch ? "No posts matched your search." : "No posts yet. Create the first post from this dashboard."}
                </div>
            )}

            <div className="post-list">
                {posts.map((post) => (
                    <PostCard
                        key={post.postId}
                        post={post}
                        currentUser={currentUser}
                        comments={commentsByPost[post.postId]}
                        commentDraft={commentDrafts[post.postId]}
                        deletingCommentId={deletingCommentId}
                        deletingPost={deletingPostId === post.postId}
                        loadingComments={loadingCommentPostId === post.postId}
                        onCommentDraftChange={onCommentDraftChange}
                        onDeleteComment={onDeleteComment}
                        onDeletePost={onDeletePost}
                        onSavePost={onSavePost}
                        onSubmitComment={onSubmitComment}
                        onToggleComments={toggleComments}
                        savingPost={savingPostId === post.postId}
                        submittingComment={submittingCommentId === post.postId}
                    />
                ))}
            </div>

            {!activeSearch && pagination.totalPages > 1 && (
                <nav className="pagination-controls" aria-label="Posts pagination">
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => onChangePage(pageNo - 1)}
                        disabled={pageNo === 0 || loading}
                    >
                        Previous
                    </button>
                    <span>Page {pageNo + 1} of {pagination.totalPages}</span>
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => onChangePage(pageNo + 1)}
                        disabled={pagination.lastPage || loading}
                    >
                        Next
                    </button>
                </nav>
            )}
        </section>
    );
};

export default PostFeed;
