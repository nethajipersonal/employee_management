import { withAuth } from 'next-auth/middleware';

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token,
    },
});

export const config = {
    matcher: [
        '/admin/:path*',
        '/manager/:path*',
        '/employee/:path*',
        '/dashboard/:path*',
        '/leaves/:path*',
        '/payslips/:path*',
        '/projects/:path*',
        '/timetrack/:path*',
    ],
};
