import Base from "../components/Base";

const About = () => {
    return (
        <Base>
            <section className="content-section">
                <div className="container narrow-container">
                    <p className="eyebrow">Project positioning</p>
                    <h1>Frontend representation for a backend-led portfolio.</h1>
                    <p className="lead">
                        This React app is intentionally lightweight. Its purpose is to provide a clean user-facing
                        entry point for the Spring Boot blogging backend while keeping the main engineering focus on
                        backend, Docker, Jenkins, testing, and deployment readiness.
                    </p>
                    <div className="info-list">
                        <div>
                            <strong>Frontend role</strong>
                            <span>Basic full-stack presentation layer</span>
                        </div>
                        <div>
                            <strong>Backend role</strong>
                            <span>Main portfolio strength and platform engineering foundation</span>
                        </div>
                        <div>
                            <strong>Deployment goal</strong>
                            <span>Use this client with the live AWS backend URL</span>
                        </div>
                    </div>
                </div>
            </section>
        </Base>
    )
};

export default About;
