import Base from "../components/Base";
import { API_BASE_URL } from "../services/helper";
import { getTokenPreview, logout } from "../services/auth-service";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Base>
            <section className="content-section">
                <div className="container">
                    <div className="section-heading">
                        <p className="eyebrow">Authenticated area</p>
                        <h1>Dashboard</h1>
                        <p>
                            Your login token is stored locally and can be used for protected Spring Boot API calls.
                        </p>
                    </div>

                    <div className="dashboard-grid">
                        <div className="feature-card">
                            <span className="status-pill">Authenticated</span>
                            <h3 className="mt-3">Session status</h3>
                            <p>You are logged in with a JWT issued by the backend authentication API.</p>
                        </div>

                        <div className="feature-card">
                            <h3>Backend URL</h3>
                            <div className="api-url mt-3">{API_BASE_URL}</div>
                        </div>

                        <div className="feature-card">
                            <h3>Token preview</h3>
                            <div className="api-url mt-3">{getTokenPreview()}</div>
                        </div>
                    </div>

                    <div className="dashboard-actions">
                        <a className="btn btn-primary" href={`${API_BASE_URL}/swagger-ui/index.html`} target="_blank" rel="noreferrer">
                            Open API docs
                        </a>
                        <a className="btn btn-outline-secondary" href={`${API_BASE_URL}/actuator/health`} target="_blank" rel="noreferrer">
                            Check health
                        </a>
                        <button className="btn btn-outline-danger" type="button" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </section>
        </Base>
    );
};

export default Dashboard;
