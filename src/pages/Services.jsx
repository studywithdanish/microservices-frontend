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
                                <h3>Service dashboard</h3>
                                <p>Loads Identity, Post, and Content data through one gateway URL.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-3">
                            <div className="feature-card">
                                <h3>Content workflow</h3>
                                <p>Creates posts and comments while the backend enforces ownership and references.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Base>
    )
}

export default Services
