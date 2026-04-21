import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function proxy(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token;

        // Protect admin routes - must have admin role
        // Skip check for admin login page
        if (pathname === '/admin/login') {
            return NextResponse.next();
        }
        if (pathname.startsWith('/admin') && token?.role !== 'admin') {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Allow access to admin login page without auth
                if (req.nextUrl.pathname === '/admin/login') return true;
                // Require auth for all other admin pages
                if (req.nextUrl.pathname.startsWith('/admin')) return !!token;
                return true;
            },
        },
    }
);

export const config = {
    matcher: ['/admin/:path*'],
};
