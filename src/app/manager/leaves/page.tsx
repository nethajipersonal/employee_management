'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Tooltip,
} from '@mui/material';
import { CheckCircleOutline, HighlightOff, VisibilityOutlined } from '@mui/icons-material';
import { format } from 'date-fns';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DataTable from '@/components/ui/DataTable';

export default function ManagerLeavesPage() {
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
            minWidth: 150,
            format: (row: any) => `${row.employeeId.firstName} ${row.employeeId.lastName}`
        },
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
        { id: 'reason', label: 'Reason', minWidth: 200 },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 150,
            align: 'right' as const,
            format: (row: any) => (
                <Box>
                    <Tooltip title="Approve">
                        <IconButton
                            color="success"
                            onClick={() => handleActionClick(row, 'approved')}
                            size="small"
                        >
                            <CheckCircleOutline />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                        <IconButton
                            color="error"
                            onClick={() => handleActionClick(row, 'rejected')}
                            size="small"
                        >
                            <HighlightOff />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    return (
        <Container maxWidth={false}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 4 }}>
                Leave Requests
            </Typography>

            <Paper sx={{ p: 2 }}>
                <DataTable
                    title="Pending Approvals"
                    columns={columns}
                    rows={leaves}
                    loading={loading}
                />
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {action === 'approved' ? 'Approve Leave' : 'Reject Leave'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                        Are you sure you want to {action} the leave request for{' '}
                        <strong>
                            {selectedLeave?.employeeId?.firstName} {selectedLeave?.employeeId?.lastName}
                        </strong>
                        ?
                    </Typography>
                    <TextField
                        label="Comments (Optional)"
                        fullWidth
                        multiline
                        rows={3}
                        value={comments}
                        onChange={e => setComments(e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2.5 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        color={action === 'approved' ? 'success' : 'error'}
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        Confirm {action === 'approved' ? 'Approval' : 'Rejection'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
