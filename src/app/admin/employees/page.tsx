'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Avatar,
    Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    EditOutlined,
    DeleteOutline,
    VisibilityOutlined,
} from '@mui/icons-material';
import DataTable from '@/components/ui/DataTable';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function EmployeesPage() {
    const router = useRouter();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async (searchTerm = '') => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);

            const res = await fetch(`/api/employees?${params.toString()}`);
            const data = await res.json();

            if (res.ok) {
                setEmployees(data);
            }
        } catch (error) {
            console.error('Failed to fetch employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        // Debounce could be added here
        fetchEmployees(value);
    };

    const columns = [
        {
            id: 'name',
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
                        {row.firstName.charAt(0)}{row.lastName.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                            {row.firstName} {row.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {row.email}
                        </Typography>
                    </Box>
                </Box>
            )
        },
        {
            id: 'department',
            label: 'Department',
            minWidth: 150,
            format: (row: any) => (
                <Box>
                    <Typography variant="body2" fontWeight={500}>{row.department}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.position}</Typography>
                </Box>
            )
        },
        {
            id: 'role',
            label: 'Role',
            minWidth: 120,
            format: (row: any) => (
                <Chip
                    label={row.role}
                    size="small"
                    sx={{
                        textTransform: 'capitalize',
                        fontWeight: 600,
                        borderRadius: 1,
                        bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                        color: 'info.main',
                    }}
                />
            )
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 120,
            format: (row: any) => (
                <Chip
                    label={row.isActive ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                        fontWeight: 600,
                        borderRadius: 1,
                        bgcolor: (theme) => alpha(theme.palette[row.isActive ? 'success' : 'error'].main, 0.1),
                        color: (theme) => theme.palette[row.isActive ? 'success' : 'error'].main,
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Tooltip title="View">
                        <IconButton
                            size="small"
                            onClick={() => router.push(`/admin/employees/${row._id}`)}
                            sx={{ color: 'primary.main', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) }}
                        >
                            <VisibilityOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                        <IconButton
                            size="small"
                            onClick={() => router.push(`/admin/employees/${row._id}/edit`)}
                            sx={{ color: 'info.main', bgcolor: (theme) => alpha(theme.palette.info.main, 0.1) }}
                        >
                            <EditOutlined fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    return (
        <Container maxWidth={false}>
            <Box sx={{ mb: 4 }}>
                <DataTable
                    title="Employees"
                    columns={columns}
                    rows={employees}
                    loading={loading}
                    onSearch={handleSearch}
                    onAdd={() => router.push('/admin/employees/new')}
                    addButtonLabel="Add Employee"
                />
            </Box>
        </Container>
    );
}
