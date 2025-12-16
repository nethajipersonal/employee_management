'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    Paper,
    Typography,
    Grid,
    Button,
    Divider,
    Alert,
    CircularProgress,
} from '@mui/material';
import { SaveOutlined, ArrowBack } from '@mui/icons-material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import FormField from '@/components/forms/FormField';

export default function NewEmployeePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: 'password123', // Default password
        employeeId: '',
        phone: '',
        gender: '',
        department: '',
        position: '',
        role: 'employee',
        joiningDate: new Date(),
        dob: null as Date | null,
        salary: {
            basic: 0,
            allowances: { hra: 0, transport: 0, medical: 0, other: 0 },
            deductions: { tax: 0, providentFund: 0, other: 0 },
        },
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        },
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNestedChange = (parent: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev as any)[parent],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create employee');
            }

            router.push('/admin/employees');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <Container maxWidth="lg">
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => router.back()}
                        color="inherit"
                    >
                        Back
                    </Button>
                    <Typography variant="h5" fontWeight={600}>
                        Add New Employee
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Paper sx={{ p: 4, mb: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Personal Information
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <FormField
                                    label="First Name"
                                    required
                                    value={formData.firstName}
                                    onChange={e => handleChange('firstName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormField
                                    label="Last Name"
                                    required
                                    value={formData.lastName}
                                    onChange={e => handleChange('lastName', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormField
                                    label="Email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormField
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={e => handleChange('phone', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormField
                                    type="select"
                                    label="Gender"
                                    value={formData.gender}
                                    onChange={e => handleChange('gender', e.target.value)}
                                    options={[
                                        { value: 'male', label: 'Male' },
                                        { value: 'female', label: 'Female' },
                                        { value: 'other', label: 'Other' },
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormField
                                    type="date"
                                    label="Date of Birth"
                                    dateValue={formData.dob}
                                    onDateChange={date => handleChange('dob', date)}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Employment Details
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <FormField
                                    label="Employee ID"
                                    required
                                    value={formData.employeeId}
                                    onChange={e => handleChange('employeeId', e.target.value)}
                                    helperText="Must be unique (e.g., EMP001)"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormField
                                    label="Department"
                                    required
                                    value={formData.department}
                                    onChange={e => handleChange('department', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormField
                                    label="Position"
                                    required
                                    value={formData.position}
                                    onChange={e => handleChange('position', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormField
                                    type="select"
                                    label="Role"
                                    required
                                    value={formData.role}
                                    onChange={e => handleChange('role', e.target.value)}
                                    options={[
                                        { value: 'employee', label: 'Employee' },
                                        { value: 'manager', label: 'Manager' },
                                        { value: 'admin', label: 'Admin' },
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormField
                                    type="date"
                                    label="Joining Date"
                                    required
                                    dateValue={formData.joiningDate}
                                    onDateChange={date => handleChange('joiningDate', date)}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Address
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormField
                                    label="Street Address"
                                    value={formData.address.street}
                                    onChange={e => handleNestedChange('address', 'street', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormField
                                    label="City"
                                    value={formData.address.city}
                                    onChange={e => handleNestedChange('address', 'city', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormField
                                    label="State"
                                    value={formData.address.state}
                                    onChange={e => handleNestedChange('address', 'state', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormField
                                    label="Zip Code"
                                    value={formData.address.zipCode}
                                    onChange={e => handleNestedChange('address', 'zipCode', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormField
                                    label="Country"
                                    value={formData.address.country}
                                    onChange={e => handleNestedChange('address', 'country', e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 4 }} />

                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Salary Structure
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <FormField
                                    type="number"
                                    label="Basic Salary"
                                    required
                                    value={formData.salary.basic}
                                    onChange={e => handleNestedChange('salary', 'basic', Number(e.target.value))}
                                    InputProps={{ startAdornment: '₹' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormField
                                    type="number"
                                    label="HRA"
                                    value={formData.salary.allowances.hra}
                                    onChange={e => {
                                        const newSalary = { ...formData.salary };
                                        newSalary.allowances.hra = Number(e.target.value);
                                        setFormData({ ...formData, salary: newSalary });
                                    }}
                                    InputProps={{ startAdornment: '₹' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormField
                                    type="number"
                                    label="Transport Allowance"
                                    value={formData.salary.allowances.transport}
                                    onChange={e => {
                                        const newSalary = { ...formData.salary };
                                        newSalary.allowances.transport = Number(e.target.value);
                                        setFormData({ ...formData, salary: newSalary });
                                    }}
                                    InputProps={{ startAdornment: '₹' }}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => router.back()}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={loading ? <CircularProgress size={20} /> : <SaveOutlined />}
                                disabled={loading}
                            >
                                Create Employee
                            </Button>
                        </Box>
                    </Paper>
                </form>
            </Container>
        </DashboardLayout>
    );
}
