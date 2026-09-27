import { myAxios } from "./helper";

test("uses credentialed requests without exposing an Authorization token in browser storage", () => {
    localStorage.setItem("authToken", "legacy-token");

    expect(myAxios.defaults.withCredentials).toBe(true);
    expect(myAxios.defaults.headers.common.Authorization).toBeUndefined();
});
