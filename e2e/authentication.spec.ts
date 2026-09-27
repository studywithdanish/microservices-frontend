import { expect, test } from "@playwright/test";

test("restores an HttpOnly session and opens the authenticated dashboard", async ({ page }) => {
    await page.route("**/api/**", async (route) => {
        const request = route.request();
        const url = new URL(request.url());

        if (url.pathname === "/api/v1/auth/login") {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                headers: { "Set-Cookie": "BLOG_ACCESS_TOKEN=e2e-token; Path=/; HttpOnly; SameSite=Lax" },
                body: JSON.stringify({ authenticated: true }),
            });
            return;
        }

        if (url.pathname === "/api/v1/auth/me") {
            const authenticated = request.headers().cookie?.includes("BLOG_ACCESS_TOKEN=e2e-token") ?? false;
            await route.fulfill(authenticated ? {
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    id: 7,
                    name: "Danish",
                    email: "danish@example.com",
                    about: "Backend engineer",
                    roles: [{ id: 1, name: "ROLE_NORMAL" }],
                }),
            } : { status: 401, contentType: "application/json", body: JSON.stringify({ message: "Unauthorized" }) });
            return;
        }

        const responses: Record<string, unknown> = {
            "/api/categories": [{ categoryId: 1, categoryTitle: "Engineering" }],
            "/api/posts": { content: [], pageNo: 0, pageSize: 5, totalElement: 0, totalPages: 0, lastPage: true },
            "/api/notifications": [],
        };
        await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(responses[url.pathname] ?? {}) });
    });

    await page.goto("/login");
    await page.getByLabel("Email").fill("danish@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole("heading", { name: "Welcome, Danish" })).toBeVisible();
    const authCookie = (await page.context().cookies()).find((cookie) => cookie.name === "BLOG_ACCESS_TOKEN");
    expect(authCookie?.httpOnly).toBe(true);
});
