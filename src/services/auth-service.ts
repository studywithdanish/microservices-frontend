export const SESSION_EXPIRED_EVENT = "session-expired";

export const notifySessionExpired = (): void => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
};
