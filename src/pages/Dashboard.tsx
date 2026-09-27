import { useNavigate } from "react-router";
import Base from "../components/Base";
import { useAuth } from "../context/AuthContext";
import NotificationCenter from "../features/dashboard/NotificationCenter";
import PostComposer from "../features/dashboard/PostComposer";
import PostFeed from "../features/dashboard/PostFeed";
import ServiceSummary from "../features/dashboard/ServiceSummary";
import { useDashboard } from "../features/dashboard/useDashboard";
import { API_BASE_URL } from "../services/helper";

const Dashboard = () => {
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const dashboard = useDashboard();

    const handleLogout = async () => {
        await signOut();
        navigate("/");
    };

    return (
        <Base>
            <section className="content-section">
                <div className="container">
                    <div className="section-heading dashboard-heading">
                        <div>
                            <p className="eyebrow">Authenticated microservices workspace</p>
                            <h1>Welcome{dashboard.currentUser?.name ? `, ${dashboard.currentUser.name}` : ""}</h1>
                            <p>
                                Manage posts, comments, and Kafka-backed notifications through one public gateway.
                            </p>
                        </div>
                        <button className="btn btn-outline-danger" type="button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>

                    {dashboard.loading && !dashboard.posts.length && (
                        <div className="alert alert-info">Loading service data...</div>
                    )}
                    {dashboard.loadError && <div className="alert alert-warning">{dashboard.loadError}</div>}

                    <ServiceSummary
                        currentUser={dashboard.currentUser}
                        categories={dashboard.categories}
                        pagination={dashboard.pagination}
                        unreadNotifications={dashboard.unreadNotifications}
                    />

                    <NotificationCenter
                        error={dashboard.notificationError}
                        loading={dashboard.loadingNotifications}
                        notifications={dashboard.notifications}
                        onMarkRead={dashboard.markRead}
                        onRefresh={dashboard.refreshNotifications}
                        unreadCount={dashboard.unreadNotifications}
                    />

                    <div className="row g-4 align-items-start mt-1">
                        <div className="col-lg-4">
                            <PostComposer
                                categories={dashboard.categories}
                                newPost={dashboard.newPost}
                                onChange={dashboard.handlePostChange}
                                onSubmit={dashboard.submitPost}
                                submitting={dashboard.submittingPost}
                            />
                        </div>

                        <div className="col-lg-8">
                            <PostFeed
                                activeSearch={dashboard.activeSearch}
                                commentDrafts={dashboard.commentDrafts}
                                commentsByPost={dashboard.commentsByPost}
                                currentUser={dashboard.currentUser}
                                deletingCommentId={dashboard.deletingCommentId}
                                deletingPostId={dashboard.deletingPostId}
                                loading={dashboard.loading}
                                onChangePage={dashboard.changePage}
                                onClearSearch={dashboard.clearSearch}
                                onCommentDraftChange={dashboard.updateCommentDraft}
                                onDeleteComment={dashboard.removeComment}
                                onDeletePost={dashboard.removePost}
                                onSavePost={dashboard.savePost}
                                onSearch={dashboard.submitSearch}
                                onSearchInputChange={dashboard.setSearchInput}
                                onSubmitComment={dashboard.submitComment}
                                onToggleComments={dashboard.loadComments}
                                pageNo={dashboard.pageNo}
                                pagination={dashboard.pagination}
                                posts={dashboard.posts}
                                savingPostId={dashboard.savingPostId}
                                searchInput={dashboard.searchInput}
                                submittingCommentId={dashboard.submittingCommentId}
                            />
                        </div>
                    </div>

                    <details className="session-details">
                        <summary>Session and operational links</summary>
                        <div className="dashboard-actions">
                            <span className="api-url">Authentication: secure HttpOnly cookie</span>
                            <a
                                className="btn btn-outline-secondary"
                                href={`${API_BASE_URL}/actuator/health`}
                                target="_blank"
                                rel="noreferrer"
                            >
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
