'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    LinearProgress,
    AvatarGroup,
    Avatar,
    IconButton,
    Menu,
    MenuItem,
} from '@mui/material';
import { Add, MoreVert, CalendarToday } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            if (res.ok) {
                setProjects(data);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'completed': return 'info';
            case 'on-hold': return 'warning';
            default: return 'default';
        }
    };

    return (
        <DashboardLayout>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Projects
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => router.push('/admin/projects/new')}
                    >
                        New Project
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {projects.map((project: any) => (
                        <Grid item xs={12} md={6} lg={4} key={project._id}>
                            <Card
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                                }}
                                onClick={() => router.push(`/admin/projects/${project._id}`)}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Chip
                                            label={project.status}
                                            color={getStatusColor(project.status) as any}
                                            size="small"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                        <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                                            <MoreVert />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="h6" gutterBottom>
                                        {project.name}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {project.description}
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="caption" color="text.secondary">Progress</Typography>
                                            <Typography variant="caption" fontWeight={600}>
                                                {/* Calculate progress based on tasks if available, else mock */}
                                                0%
                                            </Typography>
                                        </Box>
                                        <LinearProgress variant="determinate" value={0} sx={{ borderRadius: 1, height: 6 }} />
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                        <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.8rem' } }}>
                                            {project.teamMembers.map((member: any) => (
                                                <Avatar key={member._id} alt={`${member.firstName} ${member.lastName}`}>
                                                    {member.firstName[0]}
                                                </Avatar>
                                            ))}
                                        </AvatarGroup>

                                        {project.deadline && (
                                            <Chip
                                                icon={<CalendarToday sx={{ fontSize: 14 }} />}
                                                label={format(new Date(project.deadline), 'MMM d')}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: '0.75rem' }}
                                            />
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </DashboardLayout>
    );
}
