const formatDate = (value) => {
    if (!value) {
        return "Just now";
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
};

const NotificationCenter = ({
    error,
    loading,
    notifications,
    onMarkRead,
    onRefresh,
    unreadCount,
}) => (
    <section className="notification-center" aria-labelledby="notification-heading">
        <div className="notification-header">
            <div>
                <p className="eyebrow mb-1">Event-driven updates</p>
                <h2 id="notification-heading">
                    Notifications <span className="notification-count">{unreadCount}</span>
                </h2>
            </div>
            <button className="btn btn-sm btn-outline-secondary" type="button" onClick={onRefresh} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh"}
            </button>
        </div>

        {error && <div className="alert alert-warning mb-0">{error}</div>}
        {!loading && !error && notifications.length === 0 && (
            <p className="notification-empty">No notifications yet. Publish a post to exercise the Kafka workflow.</p>
        )}

        <div className="notification-list">
            {notifications.slice(0, 5).map((notification) => (
                <article className={`notification-item ${notification.read ? "is-read" : ""}`} key={notification.id}>
                    <div>
                        <div className="notification-title-row">
                            <strong>{notification.title}</strong>
                            {!notification.read && <span className="unread-dot" aria-label="Unread notification" />}
                        </div>
                        <p>{notification.message}</p>
                        <small>{formatDate(notification.createdAt)}</small>
                    </div>
                    {!notification.read && (
                        <button
                            className="btn btn-sm btn-link"
                            type="button"
                            onClick={() => onMarkRead(notification.id)}
                        >
                            Mark as read
                        </button>
                    )}
                </article>
            ))}
        </div>
    </section>
);

export default NotificationCenter;
