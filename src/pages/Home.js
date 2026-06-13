import Base from "../components/Base";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../services/helper";

const Home = () => {
    return (
        <Base>
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center g-4">
                        <div className="col-lg-7">
                            <p className="eyebrow">React frontend for Spring Boot APIs</p>
                            <h1>Blog platform client for a production-ready backend.</h1>
                            <p className="hero-copy">
                                A clean React application that represents the blogging API with authentication screens,
                                API-aware configuration, and a simple navigation flow.
                            </p>
                            <div className="hero-actions">
                                <Link className="btn btn-primary" to="/signup">Create account</Link>
                                <Link className="btn btn-outline-secondary" to="/login">Login</Link>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="api-panel">
                                <div className="panel-header">
                                    <span>Backend connection</span>
                                    <span className="status-pill">Configured</span>
                                </div>
                                <div className="api-url">{API_BASE_URL}</div>
                                <div className="panel-grid">
                                    <div>
                                        <strong>Auth</strong>
                                        <span>/api/v1/auth</span>
                                    </div>
                                    <div>
                                        <strong>Health</strong>
                                        <span>/actuator/health</span>
                                    </div>
                                    <div>
                                        <strong>Docs</strong>
                                        <span>/swagger-ui</span>
                                    </div>
                                    <div>
                                        <strong>Content</strong>
                                        <span>/api/posts</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content-section">
                <div className="container">
                    <div className="section-heading">
                        <h2>Frontend scope</h2>
                        <p>Small, practical, and intentionally aligned with the backend portfolio.</p>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="feature-card">
                                <h3>Authentication UI</h3>
                                <p>Login and signup screens call the Spring Boot authentication endpoints.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <h3>Clean routing</h3>
                                <p>React Router keeps the app structure simple and readable for reviewers.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card">
                                <h3>API configuration</h3>
                                <p>The backend URL is externalized for local and deployed environments.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Base>
    )
};

export default Home
