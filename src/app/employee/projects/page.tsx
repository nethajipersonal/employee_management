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

export default function EmployeeProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const columns = [
        { id: 'projectName', label: 'Project Name', minWidth: 150 },
        {
            id: 'managerId',
            label: 'Manager',
            minWidth: 150,
            format: (row: any) => `${row.managerId?.firstName} ${row.managerId?.lastName}`
        },
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
        { id: 'description', label: 'Description', minWidth: 200 }
    ];

    return (
        <Container maxWidth={false}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" fontWeight={600}>
                    My Projects
                </Typography>
            </Box>

            <Paper sx={{ p: 2 }}>
                <DataTable
                    title="Assigned Projects"
                    columns={columns}
                    rows={projects}
                    loading={loading}
                />
            </Paper>
        </Container>
    );
}
