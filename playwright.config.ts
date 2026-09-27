import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    retries: process.env.CI ? 2 : 0,
    reporter: "list",
    use: {
        baseURL: "http://127.0.0.1:4173",
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "desktop-chrome",
            use: { ...devices["Desktop Chrome"], channel: "chrome" },
        },
    ],
    webServer: {
        command: "npm run dev -- --host 127.0.0.1 --port 4173",
        env: { VITE_API_BASE_URL: "/" },
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
    },
});
