'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Grid,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    Chip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import FormField from '@/components/forms/FormField';

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        projectName: '',
        description: '',
        startDate: null as Date | null,
        endDate: null as Date | null,
        deadline: null as Date | null,
        status: 'active',
        priority: 'medium',
        teamMembers: [] as string[],
        tags: '',
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/employees');
            const data = await res.json();
            if (res.ok) {
                setEmployees(data);
            }
        } catch (err) {
            console.error('Failed to fetch employees:', err);
        }
    };

    const handleSubmit = async () => {
        if (!formData.projectName || !formData.startDate || !formData.endDate || !formData.deadline) {
            setError('Please fill all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create project');
            }

            router.push('/admin/projects');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <Container maxWidth="md">
                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 4 }}>
                    Create New Project
                </Typography>

                <Paper sx={{ p: 4 }}>
                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormField
                                label="Project Name"
                                value={formData.projectName}
                                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormField
                                label="Description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormField
                                type="date"
                                label="Start Date"
                                dateValue={formData.startDate}
                                onDateChange={(date) => setFormData({ ...formData, startDate: date })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormField
                                type="date"
                                label="End Date"
                                dateValue={formData.endDate}
                                onDateChange={(date) => setFormData({ ...formData, endDate: date })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FormField
                                type="date"
                                label="Deadline"
                                dateValue={formData.deadline}
                                onDateChange={(date) => setFormData({ ...formData, deadline: date })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                label="Status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'on-hold', label: 'On Hold' },
                                    { value: 'completed', label: 'Completed' },
                                ]}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormField
                                type="select"
                                label="Priority"
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                options={[
                                    { value: 'low', label: 'Low' },
                                    { value: 'medium', label: 'Medium' },
                                    { value: 'high', label: 'High' },
                                ]}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                label="Assign Team Members"
                                SelectProps={{
                                    multiple: true,
                                    renderValue: (selected: any) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value: string) => {
                                                const employee: any = employees.find((e: any) => e._id === value);
                                                return (
                                                    <Chip
                                                        key={value}
                                                        label={employee ? `${employee.firstName} ${employee.lastName}` : value}
                                                        size="small"
                                                    />
                                                );
                                            })}
                                        </Box>
                                    ),
                                }}
                                value={formData.teamMembers}
                                onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value as unknown as string[] })}
                            >
                                {employees.map((employee: any) => (
                                    <MenuItem key={employee._id} value={employee._id}>
                                        {employee.firstName} {employee.lastName} ({employee.position})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <FormField
                                label="Tags (comma separated)"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="e.g. frontend, backend, urgent"
                            />
                        </Grid>

                        <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                            <Button onClick={() => router.back()}>Cancel</Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Create Project'}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </DashboardLayout>
    );
}
