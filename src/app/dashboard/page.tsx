'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import {
    PeopleOutlined,
    EventNoteOutlined,
    ReceiptLongOutlined,
    FolderOutlined,
} from '@mui/icons-material';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

function StatsCard({ title, value, icon, color }: StatsCardProps) {
    return (
        <Paper
            elevation={2}
            sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                },
            }}
        >
            <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                    {value}
                </Typography>
            </Box>
            <Box
                sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: `${color}.lighter`,
                    color: `${color}.main`,
                }}
            >
                {icon}
            </Box>
        </Paper>
    );
}

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role) {
            const role = session.user.role;
            if (role === 'admin') {
                router.push('/admin');
            } else if (role === 'manager') {
                router.push('/manager');
            } else if (role === 'employee') {
                router.push('/employee');
            }
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '80vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Welcome, {session?.user?.name}!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's an overview of your dashboard
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Total Employees"
                        value="24"
                        icon={<PeopleOutlined fontSize="large" />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Pending Leaves"
                        value="5"
                        icon={<EventNoteOutlined fontSize="large" />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Payslips Generated"
                        value="24"
                        icon={<ReceiptLongOutlined fontSize="large" />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Active Projects"
                        value="8"
                        icon={<FolderOutlined fontSize="large" />}
                        color="info"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Quick Actions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Redirecting to your role-specific dashboard...
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}
