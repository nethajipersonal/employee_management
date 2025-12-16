'use client';

import { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Button, Paper, Avatar, List, ListItem, ListItemAvatar, ListItemText, Chip, CircularProgress } from '@mui/material';
import {
    PeopleOutlined,
    EventNoteOutlined,
    ReceiptLongOutlined,
    FolderOutlined,
    AddOutlined,
    TrendingUp,
    AccessTime,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import StatsCard from '@/components/dashboard/StatsCard';
import AttendanceChart from '@/components/dashboard/AttendanceChart';
import ProjectChart from '@/components/dashboard/ProjectChart';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({
        employees: 0,
        pendingLeaves: 0,
        projects: 0,
        payrollCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [employeesRes, leavesRes, projectsRes, payrollRes] = await Promise.all([
                    fetch('/api/employees'),
                    fetch('/api/leaves?status=pending'),
                    fetch('/api/projects'),
                    fetch('/api/payroll'),
                ]);

                const employees = await employeesRes.json();
                const leaves = await leavesRes.json();
                const projects = await projectsRes.json();
                const payroll = await payrollRes.json();

                setStats({
                    employees: Array.isArray(employees) ? employees.length : 0,
                    pendingLeaves: Array.isArray(leaves) ? leaves.length : 0,
                    projects: Array.isArray(projects) ? projects.length : 0,
                    payrollCount: Array.isArray(payroll) ? payroll.length : 0,
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const recentActivities = [
        { id: 1, user: 'John Doe', action: 'Requested leave', time: '2 hours ago', type: 'leave' },
        { id: 2, user: 'Sarah Smith', action: 'Completed project "Website Redesign"', time: '4 hours ago', type: 'project' },
        { id: 3, user: 'Mike Johnson', action: 'Clocked in late', time: '5 hours ago', type: 'attendance' },
        { id: 4, user: 'Emily Davis', action: 'Updated profile', time: '1 day ago', type: 'profile' },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl">
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Welcome back! Here's what's happening today.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddOutlined />}
                    onClick={() => router.push('/admin/employees/new')}
                    sx={{ px: 3, py: 1.5 }}
                >
                    Add Employee
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Total Employees"
                        value={stats.employees}
                        icon={<PeopleOutlined fontSize="large" />}
                        color="primary"
                        trend={{ value: 12, label: 'vs last month', isPositive: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Pending Leaves"
                        value={stats.pendingLeaves}
                        icon={<EventNoteOutlined fontSize="large" />}
                        color="warning"
                        trend={{ value: 2, label: 'new requests', isPositive: false }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Payslips Generated"
                        value={stats.payrollCount}
                        icon={<ReceiptLongOutlined fontSize="large" />}
                        color="success"
                        trend={{ value: 8, label: 'vs last month', isPositive: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatsCard
                        title="Active Projects"
                        value={stats.projects}
                        icon={<FolderOutlined fontSize="large" />}
                        color="info"
                        trend={{ value: 3, label: 'completed this week', isPositive: true }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <AttendanceChart />
                </Grid>
                <Grid item xs={12} md={4}>
                    <ProjectChart />
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Recent Activity
                            </Typography>
                            <Button size="small" endIcon={<TrendingUp />}>View All</Button>
                        </Box>
                        <List>
                            {recentActivities.map((activity, index) => (
                                <ListItem key={activity.id} divider={index !== recentActivities.length - 1} sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                                            {activity.user.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                {activity.user}
                                            </Typography>
                                        }
                                        secondary={activity.action}
                                    />
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <AccessTime fontSize="small" color="action" sx={{ fontSize: 16 }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {activity.time}
                                        </Typography>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%', borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Quick Actions
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ height: 100, display: 'flex', flexDirection: 'column', gap: 1 }}
                                    onClick={() => router.push('/admin/employees/new')}
                                >
                                    <AddOutlined fontSize="large" />
                                    Add Employee
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ height: 100, display: 'flex', flexDirection: 'column', gap: 1 }}
                                    onClick={() => router.push('/admin/leaves')}
                                >
                                    <EventNoteOutlined fontSize="large" />
                                    Approve Leaves
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ height: 100, display: 'flex', flexDirection: 'column', gap: 1 }}
                                    onClick={() => router.push('/admin/payroll')}
                                >
                                    <ReceiptLongOutlined fontSize="large" />
                                    Run Payroll
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ height: 100, display: 'flex', flexDirection: 'column', gap: 1 }}
                                    onClick={() => router.push('/admin/projects')}
                                >
                                    <FolderOutlined fontSize="large" />
                                    New Project
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}
