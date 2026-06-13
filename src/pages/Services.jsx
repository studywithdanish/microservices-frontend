import Base from "../components/Base"

const Services = () => {
    return (
        <Base>
            <section className="content-section">
                <div className="container">
                    <div className="section-heading">
                        <p className="eyebrow">Application capabilities</p>
                        <h1>Simple frontend, clear backend integration.</h1>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6 col-lg-3">
                            <div className="feature-card">
                                <h3>Account signup</h3>
                                <p>Submits users to the backend registration endpoint.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="feature-card">
                                <h3>Login flow</h3>
                                <p>Authenticates against the JWT login endpoint and stores the token locally.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="feature-card">
                                <h3>API ready</h3>
                                <p>Uses an environment variable for backend URL configuration.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="feature-card">
                                <h3>Portfolio fit</h3>
                                <p>Supports full-stack screening without hiding the backend-first focus.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Base>
    )
}

export default Services
