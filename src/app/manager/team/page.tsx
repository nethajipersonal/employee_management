'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Button,
    Menu,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import {
    Email,
    Phone,
    MoreVert,
    WorkOutline,
    PersonAdd,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useRouter } from 'next/navigation';

export default function TeamPage() {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const res = await fetch('/api/team');
            const data = await res.json();
            if (res.ok) {
                setTeam(data);
            }
        } catch (error) {
            console.error('Failed to fetch team:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography variant="h5" fontWeight={600}>
                        My Team
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={() => router.push('/admin/employees/new')} // Managers might not have access to create, but let's keep for now
                        disabled // Disable for now as managers usually don't create employees directly in this flow
                    >
                        Add Member
                    </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {team.map((member: any) => (
                            <Grid item xs={12} md={6} lg={4} key={member._id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Chip
                                                label={member.isActive ? 'Active' : 'Inactive'}
                                                color={member.isActive ? 'success' : 'default'}
                                                size="small"
                                                variant="outlined"
                                            />
                                            <IconButton size="small">
                                                <MoreVert />
                                            </IconButton>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                            <Avatar
                                                sx={{ width: 80, height: 80, mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}
                                            >
                                                {member.firstName[0]}
                                            </Avatar>
                                            <Typography variant="h6" fontWeight={600}>
                                                {member.firstName} {member.lastName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {member.position}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                <Email sx={{ fontSize: 18, mr: 1.5 }} />
                                                <Typography variant="body2">{member.email}</Typography>
                                            </Box>
                                            {member.phone && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                    <Phone sx={{ fontSize: 18, mr: 1.5 }} />
                                                    <Typography variant="body2">{member.phone}</Typography>
                                                </Box>
                                            )}
                                            <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                                                <WorkOutline sx={{ fontSize: 18, mr: 1.5 }} />
                                                <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                                    {member.department} Department
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}

                        {team.length === 0 && (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="text.secondary" align="center">
                                    No team members found in your department.
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Container>
        </DashboardLayout>
    );
}
