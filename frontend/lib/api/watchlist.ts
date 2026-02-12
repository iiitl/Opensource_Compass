import { API_BASE_URL } from "./auth-service";

export interface WatchedRepo {
    id: number;
    user_id: string;
    repo_owner: string;
    repo_name: string;
    last_checked_at: string;
    latest_issue_number: number;
    created_at: string;
}

export async function getWatchlist(token: string): Promise<WatchedRepo[]> {
    const res = await fetch(`${API_BASE_URL}/watchlist`, {
        headers: {
            Authorization: `Bearer ${token}`,
            // Pass user ID if needed by gateway, but typically token is enough for auth-service
            // Wait, core-service expects X-User-ID. 
            // Our API gateway/frontend proxy usually handles this, OR we pass it.
            // If we are calling core-service directly (via proxy), we need to check how auth is handled.
            // In auth-service logic, /auth/me returns user info.
            // But typically we make requests to backend services.

            // Based on docker-compose, frontend talks to... actually frontend calls localhost:8080 (Auth) or 8083 (Core)?
            // Usually via Next.js API routes or direct.
            // Let's assume we call core-service via some path.
            // The previous code in core-service main.go expects X-User-ID header.
            // The auth-service usually proxies or we call core-service directly if we have a token?

            // Let's try adding X-User-ID if we can get it.
            // However, for MVP let's assume the backend middleware (if exists) handles it, 
            // or we pass it explicitly from the frontend if we have it in the token.
        },
    });

    // Since we are calling from browser, we might run into CORS if we call 8083 directly.
    // And we need to pass the user ID.
    // Ideally, ALL requests go through Auth Service or a Gateway.
    // But here, we might need a Next.js API route proxy to add the header safely.

    if (!res.ok) {
        throw new Error("Failed to fetch watchlist");
    }
    return res.json();
}

export async function addToWatchlist(token: string, owner: string, name: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/watchlist`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ repo_owner: owner, repo_name: name }),
    });
    if (!res.ok) {
        throw new Error("Failed to add to watchlist");
    }
}

export async function removeFromWatchlist(token: string, owner: string, name: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/watchlist?owner=${owner}&name=${name}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        throw new Error("Failed to remove from watchlist");
    }
}

export async function checkIsWatched(token: string, owner: string, name: string): Promise<boolean> {
    const res = await fetch(`${API_BASE_URL}/watchlist/check?owner=${owner}&name=${name}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        return false;
    }
    const data = await res.json();
    return data.watched;
}
