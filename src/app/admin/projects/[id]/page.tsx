'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    AvatarGroup,
    Avatar,
    Chip,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Add, ArrowBack, FilterList } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import KanbanBoard from '@/components/projects/KanbanBoard';
import TaskModal from '@/components/projects/TaskModal';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const router = useRouter();
    const { data: session } = useSession();

    // Unwrap params
    const [projectId, setProjectId] = useState<string>('');

    useEffect(() => {
        // Handle params promise unwrapping if needed, or just access if already resolved
        // In Next.js 15+, params is a promise. In 14-, it's an object.
        // Assuming 15+ based on previous errors, but let's handle safely
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setProjectId(resolvedParams.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (projectId) {
            fetchProjectData();
        }
    }, [projectId]);

    const fetchProjectData = async () => {
        try {
            const [projectRes, tasksRes] = await Promise.all([
                fetch(`/api/projects/${projectId}`),
                fetch(`/api/tasks?projectId=${projectId}`),
            ]);

            if (projectRes.ok) setProject(await projectRes.json());
            if (tasksRes.ok) setTasks(await tasksRes.json());
        } catch (error) {
            console.error('Failed to fetch project data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskMove = async (taskId: string, newStatus: string) => {
        // Optimistic update
        const updatedTasks = tasks.map((t: any) =>
            t._id === taskId ? { ...t, status: newStatus } : t
        );
        setTasks(updatedTasks as any);

        try {
            await fetch(`/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            console.error('Failed to update task status:', error);
            fetchProjectData(); // Revert on error
        }
    };

    const handleTaskSubmit = async (data: any) => {
        const url = selectedTask
            ? `/api/tasks/${selectedTask._id}`
            : '/api/tasks';

        const method = selectedTask ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            fetchProjectData();
            setModalOpen(false);
            setSelectedTask(null);
        }
    };

    if (loading) return <CircularProgress />;
    if (!project) return <Typography>Project not found</Typography>;

    return (
        <DashboardLayout>
            <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
                            <ArrowBack />
                        </IconButton>
                        <Typography variant="h5" fontWeight={600}>
                            {project.name}
                        </Typography>
                        <Chip
                            label={project.status}
                            size="small"
                            sx={{ ml: 2, textTransform: 'capitalize' }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <AvatarGroup max={4}>
                                {project.teamMembers.map((member: any) => (
                                    <Avatar key={member._id} alt={`${member.firstName} ${member.lastName}`}>
                                        {member.firstName[0]}
                                    </Avatar>
                                ))}
                            </AvatarGroup>
                            <Button startIcon={<FilterList />} size="small">
                                Filter
                            </Button>
                        </Box>

                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => {
                                setSelectedTask(null);
                                setModalOpen(true);
                            }}
                        >
                            Add Task
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ flexGrow: 1, overflowX: 'auto', p: 3, bgcolor: 'background.default' }}>
                    <KanbanBoard
                        tasks={tasks}
                        onTaskMove={handleTaskMove}
                        onTaskClick={(task) => {
                            setSelectedTask(task);
                            setModalOpen(true);
                        }}
                    />
                </Box>

                <TaskModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleTaskSubmit}
                    task={selectedTask}
                    projectId={projectId}
                    members={project.teamMembers}
                />
            </Box>
        </DashboardLayout>
    );
}
