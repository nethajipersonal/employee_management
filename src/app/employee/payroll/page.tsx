'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DataTable from '@/components/ui/DataTable';
import { generatePayslipPDF } from '@/utils/pdfGenerator';

export default function EmployeePayrollPage() {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayslips();
    }, []);

    const fetchPayslips = async () => {
        try {
            const res = await fetch('/api/payroll');
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

    const columns = [
        {
            id: 'month',
            label: 'Month',
            minWidth: 120,
            format: (row: any) => {
                const date = new Date(row.year, row.month - 1);
                return date.toLocaleString('default', { month: 'long', year: 'numeric' });
            }
        },
        {
            id: 'basicSalary',
            label: 'Basic',
            minWidth: 100,
            format: (row: any) => row.basicSalary?.toFixed(2) || '0.00'
        },
        {
            id: 'allowances',
            label: 'Allowances',
            minWidth: 100,
            format: (row: any) => {
                const total = Object.values(row.allowances || {}).reduce((a: any, b: any) => a + b, 0);
                return (total as number).toFixed(2);
            }
        },
        {
            id: 'deductions',
            label: 'Deductions',
            minWidth: 100,
            format: (row: any) => {
                const total = Object.values(row.deductions || {}).reduce((a: any, b: any) => a + b, 0);
                return (total as number).toFixed(2);
            }
        },
        {
            id: 'netSalary',
            label: 'Net Salary',
            minWidth: 100,
            format: (row: any) => row.netSalary?.toFixed(2) || '0.00'
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
                    >
                        <Download />
                    </IconButton>
                </Tooltip>
            )
        }
    ];

    return (
        <Container maxWidth={false}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ mb: 4 }}>
                My Payslips
            </Typography>

            <Paper sx={{ p: 2 }}>
                <DataTable
                    title="Payslip History"
                    columns={columns}
                    rows={payslips}
                    loading={loading}
                />
            </Paper>
        </Container>
    );
}
