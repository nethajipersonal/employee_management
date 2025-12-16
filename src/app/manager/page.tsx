'use client';

import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { PeopleOutlined, EventNoteOutlined, FolderOutlined } from '@mui/icons-material';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
}

function StatsCard({ title, value, icon, color }: StatsCardProps) {
    return (
        <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            </Box>
        </Paper>
    );
}

export default function ManagerDashboard() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Manager Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your team and projects
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatsCard
                        title="Team Members"
                        value="8"
                        icon={<PeopleOutlined fontSize="large" />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatsCard
                        title="Pending Leave Approvals"
                        value="3"
                        icon={<EventNoteOutlined fontSize="large" />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatsCard
                        title="My Projects"
                        value="4"
                        icon={<FolderOutlined fontSize="large" />}
                        color="info"
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Team Overview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your team performance and pending tasks
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}
