'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import FormField from '@/components/forms/FormField';
import { useSession } from 'next-auth/react';

export default function ExpensesPage() {
  const { data: session } = useSession();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    category: 'travel',
    description: '',
    date: null as Date | null,
    receiptUrl: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('/api/expenses');
      const data = await res.json();
      if (res.ok) setExpenses(data);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.date || !formData.description) {
      setError('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit expense');

      setOpenModal(false);
      setFormData({
        amount: '',
        category: 'travel',
        description: '',
        date: null,
        receiptUrl: '',
      });
      fetchExpenses();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchExpenses();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h5" fontWeight={600}>
            Expense Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenModal(true)}
          >
            New Claim
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Status</TableCell>
                {['admin', 'manager'].includes(session?.user?.role || '') && (
                  <TableCell>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : expenses.map((expense: any) => (
                <TableRow key={expense._id}>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{expense.category}</TableCell>
                  <TableCell>${expense.amount}</TableCell>
                  <TableCell>
                    {expense.employeeId?.firstName} {expense.employeeId?.lastName}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={expense.status}
                      color={getStatusColor(expense.status) as any}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  {['admin', 'manager'].includes(session?.user?.role || '') && (
                    <TableCell>
                      {expense.status === 'pending' && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            color="success"
                            onClick={() => handleStatusUpdate(expense._id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleStatusUpdate(expense._id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {!loading && expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No expenses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle>New Expense Claim</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 2, mt: 1 }}>{error}</Alert>}
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={12}>
                <FormField
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormField
                  label="Amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <FormField
                  type="select"
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  options={[
                    { value: 'travel', label: 'Travel' },
                    { value: 'food', label: 'Food' },
                    { value: 'accommodation', label: 'Accommodation' },
                    { value: 'supplies', label: 'Supplies' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </Grid>
              <Grid item xs={12}>
                <FormField
                  type="date"
                  label="Date"
                  dateValue={formData.date}
                  onDateChange={(date) => setFormData({ ...formData, date: date })}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
              {submitting ? <CircularProgress size={24} /> : 'Submit Claim'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
}
