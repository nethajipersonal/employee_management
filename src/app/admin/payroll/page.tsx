'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    Button,
    Grid,
    MenuItem,
    TextField,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Avatar,
    Chip,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Download, ReceiptLong } from '@mui/icons-material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import { generatePayslipPDF } from '@/utils/pdfGenerator';

export default function AdminPayrollPage() {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [message, setMessage] = useState('');
    const [filters, setFilters] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    useEffect(() => {
        fetchPayslips();
    }, [filters]);

    const fetchPayslips = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/payroll?month=${filters.month}&year=${filters.year}`);
            const data = await res.json();
            if (res.ok) {
                setPayslips(data);
            }
        } catch (error) {
            console.error('Failed to fetch payslips:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        setMessage('');
        try {
            const res = await fetch('/api/payroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filters),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                fetchPayslips();
            } else {
                setMessage(data.error || 'Failed to generate payroll');
            }
        } catch (error) {
            console.error('Generation error:', error);
            setMessage('An error occurred');
        } finally {
            setGenerating(false);
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
                            fontWeight: 600
                        }}
                    >
                        {row.employeeId.firstName.charAt(0)}{row.employeeId.lastName.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                            {row.employeeId.firstName} {row.employeeId.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {row.employeeId.employeeId} • {row.employeeId.department}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            id: 'basicSalary',
            label: 'Basic',
            minWidth: 120,
            format: (row: any) => (
                <Typography variant="body2" color="text.secondary">
                    ${row.basicSalary?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                </Typography>
            )
        },
        {
            id: 'grossSalary',
            label: 'Gross',
            minWidth: 120,
            format: (row: any) => (
                <Typography variant="body2" fontWeight={500}>
                    ${row.grossSalary?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                </Typography>
            )
        },
        {
            id: 'netSalary',
            label: 'Net Salary',
            minWidth: 120,
            format: (row: any) => (
                <Typography variant="subtitle2" fontWeight={700} color="success.main">
                    ${row.netSalary?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                </Typography>
            )
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 120,
            format: (row: any) => (
                <Chip
                    label={row.status}
                    size="small"
                    color={row.status === 'paid' ? 'success' : 'warning'}
                    sx={{
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        borderRadius: 1,
                        bgcolor: (theme) => alpha(theme.palette[row.status === 'paid' ? 'success' : 'warning'].main, 0.1),
                        color: (theme) => theme.palette[row.status === 'paid' ? 'success' : 'warning'].main,
                    }}
                />
            )
        },
        {
            id: 'actions',
            label: 'Actions',
            minWidth: 100,
            align: 'right' as const,
            format: (row: any) => (
                <Tooltip title="Download PDF">
                    <IconButton
                        color="primary"
                        onClick={() => generatePayslipPDF(row)}
                        size="small"
                        sx={{
                            bgcolor: 'primary.lighter',
                            '&:hover': { bgcolor: 'primary.light', color: 'white' }
                        }}
                    >
                        <Download fontSize="small" />
                    </IconButton>
                </Tooltip>
            )
        }
    ];

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' },
    ];

    const years = [2024, 2025, 2026];

    return (
        <Container maxWidth={false}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h5" fontWeight={600}>
                    Payroll Management
                </Typography>
            </Box>

            {message && (
                <Alert severity={message.includes('Failed') ? 'error' : 'success'} sx={{ mb: 3 }}>
                    {message}
                </Alert>
            )}

            <Paper sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Month"
                            value={filters.month}
                            onChange={e => setFilters({ ...filters, month: Number(e.target.value) })}
                            size="small"
                        >
                            {months.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            fullWidth
                            label="Year"
                            value={filters.year}
                            onChange={e => setFilters({ ...filters, year: Number(e.target.value) })}
                            size="small"
                        >
                            {years.map(year => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={generating ? <CircularProgress size={20} color="inherit" /> : <ReceiptLong />}
                            onClick={handleGenerate}
                            disabled={generating}
                        >
                            Generate Payroll
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ p: 2 }}>
                <DataTable
                    title={`Payslips for ${months.find(m => m.value === filters.month)?.label} ${filters.year}`}
                    columns={columns}
                    rows={payslips}
                    loading={loading}
                />
            </Paper>
        </Container>
    );
}
