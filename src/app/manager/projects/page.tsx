'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    IconButton,
    Tooltip,
    Chip,
    Alert,
} from '@mui/material';
import { AddOutlined, EditOutlined } from '@mui/icons-material';
import { format } from 'date-fns';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import FormField from '@/components/forms/FormField';
import { useSession } from 'next-auth/react';

export default function ManagerProjectsPage() {
    const { data: session } = useSession();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        startDate: null as Date | null,
        endDate: null as Date | null,
        status: 'planning',
    });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

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

    const handleSubmit = async () => {
        if (!formData.projectName || !formData.startDate || !formData.endDate) {
            setError('Please fill all required fields');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to save project');
            }

            setOpen(false);
            fetchProjects();
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (project: any) => {
        setFormData({
            projectName: project.projectName,
            description: project.description,
            startDate: new Date(project.startDate),
            endDate: new Date(project.endDate),
            status: project.status,
        });
        setEditingId(project._id);
        setOpen(true);
    };

    const resetForm = () => {
        setFormData({
            projectName: '',
            description: '',
            startDate: null,
            endDate: null,
            status: 'planning',
        });
        setEditingId(null);
        setError('');
    };

    const columns = [
        { id: 'projectName', label: 'Project Name', minWidth: 150 },
        {
            id: 'startDate',
            label: 'Start Date',
            minWidth: 120,
            format: (row: any) => format(new Date(row.startDate), 'MMM d, yyyy')
        },
        {
            id: 'endDate',
            label: 'End Date',
            minWidth: 120,
            format: (row: any) => format(new Date(row.endDate), 'MMM d, yyyy')
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (row: any) => (
                <Chip
                    label={row.status}
                    size="small"
                    color={
                        row.status === 'active' ? 'success' :
                            row.status === 'completed' ? 'info' :
                                row.status === 'on-hold' ? 'warning' : 'default'
                    }
                    sx={{ textTransform: 'capitalize' }}
                />
            )
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 100,
            align: 'right' as const,
            format: (row: any) => (
                <Box>
                    <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEdit(row)}>
                            <EditOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    return (
        <Container maxWidth={false}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h5" fontWeight={600}>
                    My Projects
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddOutlined />}
                    onClick={() => {
                        resetForm();
                        setOpen(true);
                    }}
                >
                    New Project
                </Button>
            </Box>

            <Paper sx={{ p: 2 }}>
                <DataTable
                    title="Projects I Manage"
                    columns={columns}
                    rows={projects}
                    loading={loading}
                />
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? 'Edit Project' : 'New Project'}</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <FormField
                                label="Project Name"
                                value={formData.projectName}
                                onChange={e => setFormData({ ...formData, projectName: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormField
                                label="Description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="date"
                                label="Start Date"
                                dateValue={formData.startDate}
                                onDateChange={date => setFormData({ ...formData, startDate: date })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="date"
                                label="End Date"
                                dateValue={formData.endDate}
                                onDateChange={date => setFormData({ ...formData, endDate: date })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                label="Status"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                options={[
                                    { value: 'planning', label: 'Planning' },
                                    { value: 'active', label: 'Active' },
                                    { value: 'completed', label: 'Completed' },
                                    { value: 'on-hold', label: 'On Hold' },
                                ]}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
                        {editingId ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
