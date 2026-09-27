import CustomNavbar from "./CustomNavbar";
import type { ReactNode } from "react";

const Base = ({ children }: { children: ReactNode }) => {
    return (
        <div className="app-shell">
            <CustomNavbar />

            <main className="app-main">
                {children}
            </main>

            <footer className="app-footer">
                <span>MyBlogs frontend</span>
                <span>React client for the Spring Boot blog API</span>
            </footer>
        </div>
    );
};

export default Base;
