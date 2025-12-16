'use client';

import { Box, Container, Grid, Paper, Typography, Button } from '@mui/material';
import { EventNoteOutlined, ReceiptLongOutlined, AccessTimeOutlined } from '@mui/icons-material';

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

export default function EmployeeDashboard() {
    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={600} gutterBottom>
                    Employee Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Welcome back! Here's your overview
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatsCard
                        title="Leave Balance"
                        value="12 Days"
                        icon={<EventNoteOutlined fontSize="large" />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatsCard
                        title="This Month Salary"
                        value="₹45,000"
                        icon={<ReceiptLongOutlined fontSize="large" />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatsCard
                        title="Hours This Month"
                        value="160h"
                        icon={<AccessTimeOutlined fontSize="large" />}
                        color="info"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Quick Actions
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <Button variant="outlined" fullWidth>
                                Apply for Leave
                            </Button>
                            <Button variant="outlined" fullWidth>
                                Clock In/Out
                            </Button>
                            <Button variant="outlined" fullWidth>
                                View Payslips
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            My Projects
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            You are assigned to 2 active projects
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
