'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    TextField,
} from '@mui/material';
import { AccessTime, TimerOutlined, CheckCircleOutline } from '@mui/icons-material';
import { format, differenceInSeconds } from 'date-fns';

export default function ClockIn() {
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [status, setStatus] = useState<'none' | 'clocked-in' | 'completed'>('none');
    const [log, setLog] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
    const [elapsedTime, setElapsedTime] = useState(0);
    const [notes, setNotes] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTodayLog();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'clocked-in' && log?.clockIn) {
            interval = setInterval(() => {
                const seconds = differenceInSeconds(new Date(), new Date(log.clockIn));
                setElapsedTime(seconds);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, log]);

    const fetchTodayLog = async () => {
        try {
            const res = await fetch(`/api/attendance?date=${new Date().toISOString()}`);
            const data = await res.json();

            if (res.ok && data.length > 0) {
                const todayLog = data[0];
                setLog(todayLog);
                if (todayLog.clockOut) {
                    setStatus('completed');
                } else {
                    setStatus('clocked-in');
                    const seconds = differenceInSeconds(new Date(), new Date(todayLog.clockIn));
                    setElapsedTime(seconds);
                }
            } else {
                setStatus('none');
            }
        } catch (err) {
            console.error('Failed to fetch attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: 'clock-in' | 'clock-out') => {
        setActionLoading(true);
        setError('');
        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, notes }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Action failed');
            }

            setLog(data);
            if (action === 'clock-in') {
                setStatus('clocked-in');
            } else {
                setStatus('completed');
            }
            setNotes('');
        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return <CircularProgress size={24} />;
    }

    return (
        <Card elevation={3} sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Attendance
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {format(new Date(), 'EEEE, d MMMM yyyy')}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
                        {error}
                    </Alert>
                )}

                <Box sx={{ mb: 4 }}>
                    {status === 'none' && (
                        <AccessTime sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    )}
                    {status === 'clocked-in' && (
                        <Box>
                            <TimerOutlined sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h3" fontWeight={600} color="primary.main">
                                {formatTime(elapsedTime)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Started at {format(new Date(log.clockIn), 'h:mm a')}
                            </Typography>
                        </Box>
                    )}
                    {status === 'completed' && (
                        <Box>
                            <CheckCircleOutline sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                            <Typography variant="h5" color="success.main" gutterBottom>
                                Work Day Completed
                            </Typography>
                            <Typography variant="body2">
                                Total Hours: {log.totalHours}h
                            </Typography>
                        </Box>
                    )}
                </Box>

                {status !== 'completed' && (
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={status === 'none' ? "Optional notes..." : "Work summary..."}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            color={status === 'none' ? 'primary' : 'warning'}
                            onClick={() => handleAction(status === 'none' ? 'clock-in' : 'clock-out')}
                            disabled={actionLoading}
                            startIcon={actionLoading ? <CircularProgress size={20} color="inherit" /> : <AccessTime />}
                        >
                            {status === 'none' ? 'Clock In' : 'Clock Out'}
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
