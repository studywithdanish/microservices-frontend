import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: { port: 3000 },
    preview: { port: 3000 },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/setupTests.ts"],
        exclude: ["e2e/**", "node_modules/**", "dist/**"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["src/**/*.{ts,tsx}"],
            exclude: ["src/**/*.d.ts", "src/main.tsx", "src/types.ts"],
        },
    },
});
