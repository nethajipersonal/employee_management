'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
} from '@mui/material';
import FormField from '@/components/forms/FormField';

interface TaskModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>; // eslint-disable-line @typescript-eslint/no-explicit-any
    task?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    projectId: string;
    members: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function TaskModal({
    open,
    onClose,
    onSubmit,
    task,
    projectId,
    members,
}: TaskModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignedTo: [] as string[],
        dueDate: null as Date | null,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description || '',
                status: task.status,
                priority: task.priority,
                assignedTo: task.assignedTo?.map((u: any) => u._id) || [], // eslint-disable-line @typescript-eslint/no-explicit-any
                dueDate: task.dueDate ? new Date(task.dueDate) : null,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'todo',
                priority: 'medium',
                assignedTo: [],
                dueDate: null,
            });
        }
    }, [task, open]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSubmit({ ...formData, projectId });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12}>
                        <FormField
                            label="Task Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <FormField
                            label="Description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            type="select"
                            label="Status"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: 'todo', label: 'To Do' },
                                { value: 'in-progress', label: 'In Progress' },
                                { value: 'review', label: 'Review' },
                                { value: 'done', label: 'Done' },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            type="select"
                            label="Priority"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                            options={[
                                { value: 'low', label: 'Low' },
                                { value: 'medium', label: 'Medium' },
                                { value: 'high', label: 'High' },
                            ]}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormField
                            type="date"
                            label="Due Date"
                            dateValue={formData.dueDate}
                            onDateChange={(date) => setFormData({ ...formData, dueDate: date })}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            fullWidth
                            label="Assign To"
                            SelectProps={{ multiple: true }}
                            value={formData.assignedTo}
                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value as unknown as string[] })}
                        >
                            {members.map((member) => (
                                <MenuItem key={member._id} value={member._id}>
                                    {member.firstName} {member.lastName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2.5 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                    {task ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
