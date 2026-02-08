import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that don't require authentication
const publicPaths = ['/', '/onboarding', '/auth/login', '/auth/success']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if path is public
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    // If public path, allow access
    if (isPublicPath) {
        return NextResponse.next()
    }

    // Check for auth token in cookies
    const token = request.cookies.get('auth_token')

    // If no token and accessing protected route, redirect to login
    if (!token) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        url.searchParams.set('error', 'auth_required')
        return NextResponse.redirect(url)
    }

    // Clone request headers and inject Authorization header from cookie
    // This allows backend services to continue using Bearer token auth
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${token.value}`)

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
