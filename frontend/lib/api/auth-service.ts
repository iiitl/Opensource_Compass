// Basic Auth Service configuration

export const API_BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVICE_URL || "/api/core"; // Proxies to Core Service

// For local dev, we might be calling via a proxy or direct.
// If direct call to 8083 from browser, we need CORS enabled.
// Core Service implementation enabled CORS.
