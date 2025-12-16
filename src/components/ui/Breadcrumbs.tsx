'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Breadcrumbs as MUIBreadcrumbs, Typography, Link as MUILink } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

export default function Breadcrumbs() {
    const pathname = usePathname();
    const pathnames = pathname.split('/').filter((x) => x);

    // Don't show breadcrumbs on dashboard or login
    if (pathname === '/dashboard' || pathname === '/login') {
        return null;
    }

    return (
        <MUIBreadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 3 }}
        >
            <MUILink
                component={Link}
                href="/dashboard"
                underline="hover"
                color="inherit"
                sx={{ display: 'flex', alignItems: 'center' }}
            >
                Dashboard
            </MUILink>
            {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                const title = value.charAt(0).toUpperCase() + value.slice(1);

                return last ? (
                    <Typography color="text.primary" key={to} sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                ) : (
                    <MUILink
                        component={Link}
                        href={to}
                        underline="hover"
                        color="inherit"
                        key={to}
                    >
                        {title}
                    </MUILink>
                );
            })}
        </MUIBreadcrumbs>
    );
}
