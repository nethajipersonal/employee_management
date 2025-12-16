'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    Alert,
} from '@mui/material';
import { AddOutlined, EventNote } from '@mui/icons-material';
import { format } from 'date-fns';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import FormField from '@/components/forms/FormField';

export default function EmployeeLeavesPage() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [balance, setBalance] = useState({ casual: 0, sick: 0, annual: 0 });
    const [formData, setFormData] = useState({
        type: 'Casual',
        startDate: null as Date | null,
        endDate: null as Date | null,
        reason: '',
    });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchLeaves();
        // In a real app, fetch balance from user profile API
        // For now, hardcoded or mocked
        setBalance({ casual: 12, sick: 10, annual: 15 });
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await fetch('/api/leaves');
            const data = await res.json();
            if (res.ok) {
                setLeaves(data);
            }
        } catch (error) {
            console.error('Failed to fetch leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.startDate || !formData.endDate || !formData.reason) {
            setError('Please fill all fields');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/leaves', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to apply leave');
            }

            setOpen(false);
            fetchLeaves();
            setFormData({
                type: 'Casual',
                startDate: null,
                endDate: null,
                reason: '',
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            id: 'type',
            label: 'Type',
            minWidth: 100
        },
        {
            id: 'startDate',
            label: 'From',
            minWidth: 120,
            format: (row: any) => format(new Date(row.startDate), 'MMM d, yyyy')
        },
        {
            id: 'endDate',
            label: 'To',
            minWidth: 120,
            format: (row: any) => format(new Date(row.endDate), 'MMM d, yyyy')
        },
        {
            id: 'days',
            label: 'Days',
            minWidth: 80
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
                        row.status === 'approved' ? 'success' :
                            row.status === 'pending' ? 'warning' :
                                row.status === 'rejected' ? 'error' : 'default'
                    }
                    sx={{ textTransform: 'capitalize' }}
                />
            )
        },
        { id: 'reason', label: 'Reason', minWidth: 200 }
    ];

    return (
        <Container maxWidth={false}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h5" fontWeight={600}>
                    My Leaves
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddOutlined />}
                    onClick={() => setOpen(true)}
                >
                    Apply Leave
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {Object.entries(balance).map(([type, count]) => (
                    <Grid item xs={12} sm={4} key={type}>
                        <Card>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.main' }}>
                                    <EventNote />
                                </Box>
                                <Box>
                                    <Typography color="text.secondary" variant="body2" sx={{ textTransform: 'capitalize' }}>
                                        {type} Leave
                                    </Typography>
                                    <Typography variant="h5" fontWeight={600}>
                                        {count}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 2 }}>
                <DataTable
                    title="Leave History"
                    columns={columns}
                    rows={leaves}
                    loading={loading}
                />
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Apply for Leave</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <FormField
                                type="select"
                                label="Leave Type"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                options={[
                                    { value: 'Casual', label: 'Casual Leave' },
                                    { value: 'Sick', label: 'Sick Leave' },
                                    { value: 'Earned', label: 'Earned Leave' },
                                    { value: 'LOP', label: 'Loss of Pay' },
                                ]}
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
                        <Grid item xs={12}>
                            <FormField
                                label="Reason"
                                multiline
                                rows={3}
                                value={formData.reason}
                                onChange={e => setFormData({ ...formData, reason: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
