import type { Category, PostPage, User } from "../../types";

interface ServiceSummaryProps {
    currentUser: User | null;
    categories: Category[];
    pagination: PostPage;
    unreadNotifications: number;
}

const ServiceSummary = ({ currentUser, categories, pagination, unreadNotifications }: ServiceSummaryProps) => (
    <div className="dashboard-grid mb-4">
        <div className="feature-card">
            <span className="status-pill">Identity Service</span>
            <h3 className="mt-3">{currentUser?.email || "Authenticated session"}</h3>
            <p>{currentUser?.about || "Secure cookie session verified through the gateway."}</p>
        </div>
        <div className="feature-card">
            <span className="status-pill">Content Service</span>
            <h3 className="mt-3">{categories.length} categories</h3>
            <p>Categories and comments are independently owned by the Content Service.</p>
        </div>
        <div className="feature-card">
            <span className="status-pill">Post Service</span>
            <h3 className="mt-3">{pagination.totalElement} posts</h3>
            <p>Server-side pagination keeps the React client responsive as content grows.</p>
        </div>
        <div className="feature-card">
            <span className="status-pill">Kafka workflow</span>
            <h3 className="mt-3">{unreadNotifications} unread</h3>
            <p>Publication events are consumed asynchronously by the Notification Service.</p>
        </div>
    </div>
);

export default ServiceSummary;
