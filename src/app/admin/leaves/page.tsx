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
    TextField,
    IconButton,
    Tooltip,
    Avatar,
    Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import { format } from 'date-fns';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DataTable from '@/components/ui/DataTable';

export default function AdminLeavesPage() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState<any>(null);
    const [action, setAction] = useState<'approved' | 'rejected' | null>(null);
    const [comments, setComments] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            // Admin sees all pending leaves by default or we can add filters later
            const res = await fetch('/api/leaves?status=pending');
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

    const handleActionClick = (leave: any, actionType: 'approved' | 'rejected') => {
        setSelectedLeave(leave);
        setAction(actionType);
        setComments('');
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!selectedLeave || !action) return;

        setProcessing(true);
        try {
            const res = await fetch(`/api/leaves/${selectedLeave._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: action, comments }),
            });

            if (res.ok) {
                setOpen(false);
                fetchLeaves();
            }
        } catch (error) {
            console.error('Failed to update leave:', error);
        } finally {
            setProcessing(false);
        }
    };

    const columns = [
        {
            id: 'employee',
            label: 'Employee',
            minWidth: 250,
            format: (row: any) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            bgcolor: 'primary.main',
                            width: 40,
                            height: 40,
                            fontSize: '1rem',
                            fontWeight: 600,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    >
                        {row.employeeId?.firstName?.charAt(0) || 'U'}{row.employeeId?.lastName?.charAt(0) || ''}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                            {row.employeeId?.firstName} {row.employeeId?.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {row.employeeId?.department || 'Employee'}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            id: 'type',
            label: 'Type',
            minWidth: 120,
            format: (row: any) => (
                <Chip
                    label={row.leaveType}
                    size="small"
                    sx={{
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        borderRadius: 1,
                        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                        color: 'secondary.main',
                    }}
                />
            )
        },
        {
            id: 'dates',
            label: 'Duration',
            minWidth: 200,
            format: (row: any) => (
                <Box>
                    <Typography variant="body2" fontWeight={500}>
                        {format(new Date(row.startDate), 'MMM d')} - {format(new Date(row.endDate), 'MMM d, yyyy')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={500}>
                        {row.numberOfDays} days
                    </Typography>
                </Box>
            )
        },
        {
            id: 'reason',
            label: 'Reason',
            minWidth: 200,
            format: (row: any) => (
                <Typography variant="body2" color="text.secondary" sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                }}>
                    {row.reason}
                </Typography>
            )
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 150,
            align: 'right' as const,
            format: (row: any) => (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="Approve">
                        <IconButton
                            onClick={() => handleActionClick(row, 'approved')}
                            size="small"
                            sx={{
                                color: 'success.main',
                                bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                                '&:hover': { bgcolor: (theme) => alpha(theme.palette.success.main, 0.2) }
                            }}
                        >
                            <CheckCircleOutline fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                        <IconButton
                            onClick={() => handleActionClick(row, 'rejected')}
                            size="small"
                            sx={{
                                color: 'error.main',
                                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                                '&:hover': { bgcolor: (theme) => alpha(theme.palette.error.main, 0.2) }
                            }}
                        >
                            <HighlightOff fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    return (
        <Container maxWidth={false}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 4 }}>
                All Leave Requests
            </Typography>

            <Paper sx={{ p: 2 }}>
                <DataTable
                    title="Leave Requests"
                    columns={columns}
                    rows={leaves}
                    loading={loading}
                />
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Process Leave Request</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mt: 2 }}>
                        Are you sure you want to {action} this leave request?
                    </Typography>
                    {action === 'rejected' && (
                        <TextField
                            fullWidth
                            label="Rejection Reason"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            sx={{ mt: 2 }}
                            multiline
                            rows={3}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        color={action === 'approved' ? 'success' : 'error'}
                    >
                        Confirm {action === 'approved' ? 'Approval' : 'Rejection'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
