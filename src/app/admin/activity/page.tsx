'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
} from '@mui/material';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function ActivityLogPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/activity');
            const data = await res.json();
            if (res.ok) setLogs(data);
        } catch (err) {
            console.error('Failed to fetch logs', err);
        } finally {
            setLoading(false);
        }
    };

    const getActionColor = (action: string) => {
        if (action.includes('create')) return 'success';
        if (action.includes('update')) return 'info';
        if (action.includes('delete')) return 'error';
        return 'default';
    };

    return (
        <DashboardLayout>
            <Container maxWidth="lg">
                <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 4 }}>
                    System Activity Log
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date & Time</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>Action</TableCell>
                                <TableCell>Resource</TableCell>
                                <TableCell>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : logs.map((log: any) => (
                                <TableRow key={log._id}>
                                    <TableCell>
                                        {new Date(log.createdAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {log.userId ? (
                                            <Box>
                                                <Typography variant="body2" fontWeight={600}>
                                                    {log.userId.firstName} {log.userId.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {log.userId.role}
                                                </Typography>
                                            </Box>
                                        ) : (
                                            'System'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={log.action}
                                            color={getActionColor(log.action) as any}
                                            size="small"
                                            sx={{ textTransform: 'uppercase', fontSize: '0.7rem' }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textTransform: 'capitalize' }}>
                                        {log.resourceType}
                                    </TableCell>
                                    <TableCell>{log.details || '-'}</TableCell>
                                </TableRow>
                            ))}
                            {!loading && logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No activity logs found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </DashboardLayout>
    );
}
