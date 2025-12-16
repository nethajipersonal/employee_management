'use client';

import { useSession } from 'next-auth/react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Avatar,
    Grid,
    Divider,
    Chip,
} from '@mui/material';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function ProfilePage() {
    const { data: session } = useSession();
    const user = session?.user;

    if (!user) {
        return null;
    }

    return (
        <DashboardLayout>
            <Container maxWidth="md">
                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 4 }}>
                    My Profile
                </Typography>

                <Paper sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                mb: 2,
                                bgcolor: 'primary.main',
                                fontSize: '2.5rem',
                                fontWeight: 600
                            }}
                        >
                            {user.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Typography variant="h5" fontWeight={600}>
                            {user.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            {user.email}
                        </Typography>
                        <Chip
                            label={user.role}
                            color="primary"
                            variant="outlined"
                            sx={{ textTransform: 'capitalize', mt: 1 }}
                        />
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Full Name
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {user.name}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Email Address
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Role
                                </Typography>
                                <Typography variant="body1" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                                    {user.role}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    User ID
                                </Typography>
                                <Typography variant="body1" fontWeight={500}>
                                    {user.id}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </DashboardLayout>
    );
}
