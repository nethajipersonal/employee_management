'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Chip,
} from '@mui/material';
import { format } from 'date-fns';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DataTable from '@/components/ui/DataTable';

export default function AdminAttendancePage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/attendance');
            const data = await res.json();
            if (res.ok) {
                setLogs(data);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            id: 'employee',
            label: 'Employee',
            minWidth: 150,
            format: (row: any) => row.employeeId ? `${row.employeeId.firstName} ${row.employeeId.lastName}` : 'Unknown'
        },
        {
            id: 'date',
            label: 'Date',
            minWidth: 120,
            format: (row: any) => format(new Date(row.date), 'MMM d, yyyy')
        },
        {
            id: 'clockIn',
            label: 'Clock In',
            minWidth: 100,
            format: (row: any) => row.clockIn ? format(new Date(row.clockIn), 'h:mm a') : '-'
        },
        {
            id: 'clockOut',
            label: 'Clock Out',
            minWidth: 100,
            format: (row: any) => row.clockOut ? format(new Date(row.clockOut), 'h:mm a') : '-'
        },
        {
            id: 'totalHours',
            label: 'Hours',
            minWidth: 80,
            format: (row: any) => row.totalHours || '-'
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
                        row.status === 'present' ? 'success' :
                            row.status === 'late' ? 'warning' :
                                row.status === 'absent' ? 'error' : 'default'
                    }
                    sx={{ textTransform: 'capitalize' }}
                />
            )
        },
        { id: 'notes', label: 'Notes', minWidth: 150 }
    ];

    return (
        <Container maxWidth={false}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 4 }}>
                All Attendance Logs
            </Typography>

            <Paper sx={{ p: 2 }}>
                <DataTable
                    title="Attendance History"
                    columns={columns}
                    rows={logs}
                    loading={loading}
                />
            </Paper>
        </Container>
    );
}
