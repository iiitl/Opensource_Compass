import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that don't require authentication
const publicPaths = ['/', '/onboarding', '/auth/login', '/auth/success']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if this is an API route
    const isApiRoute = pathname.startsWith('/api/')

    // Check if path is public
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    // Check for auth token in cookies
    const token = request.cookies.get('auth_token')

    // For API routes, always inject Authorization header if token exists
    if (isApiRoute) {
        if (token) {
            const requestHeaders = new Headers(request.headers)
            requestHeaders.set('Authorization', `Bearer ${token.value}`)
            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            })
        }
        // No token for API route - let it through, backend will handle 401
        return NextResponse.next()
    }

    // For non-API routes: enforce authentication
    // If public path, allow access
    if (isPublicPath) {
        return NextResponse.next()
    }

    // If no token and accessing protected route, redirect to login
    if (!token) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        url.searchParams.set('error', 'auth_required')
        return NextResponse.redirect(url)
    }

    // Protected route with valid token - allow through
    return NextResponse.next()
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths INCLUDING api routes
         * Exclude only:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
