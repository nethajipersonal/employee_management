'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';

export default function TimeTrackRedirectPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;

        if (!session) {
            router.push('/login');
            return;
        }

        const role = session.user?.role;

        switch (role) {
            case 'admin':
                router.push('/admin/attendance');
                break;
            case 'manager':
                router.push('/manager/attendance');
                break;
            case 'employee':
                router.push('/employee/attendance');
                break;
            default:
                router.push('/dashboard');
        }
    }, [session, status, router]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
            }}
        >
            <CircularProgress />
        </Box>
    );
}
