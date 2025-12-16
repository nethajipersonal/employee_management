'use client';


import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    Avatar,
    AvatarGroup,
} from '@mui/material';
import {
    AccessTime,
    AttachFile,
    Comment,
} from '@mui/icons-material';
import { Draggable } from '@hello-pangea/dnd';
import { format } from 'date-fns';

interface TaskCardProps {
    task: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    index: number;
    onClick: (task: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export default function TaskCard({ task, index, onClick }: TaskCardProps) {
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(task)}
                    sx={{
                        mb: 2,
                        cursor: 'grab',
                        bgcolor: snapshot.isDragging ? 'action.hover' : 'background.paper',
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                            boxShadow: 3,
                        },
                    }}
                >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Chip
                                label={task.priority}
                                size="small"
                                color={getPriorityColor(task.priority) as any} // eslint-disable-line @typescript-eslint/no-explicit-any
                                sx={{ height: 20, fontSize: '0.7rem', textTransform: 'capitalize' }}
                            />
                            {task.dueDate && (
                                <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', fontSize: '0.75rem' }}>
                                    <AccessTime sx={{ fontSize: 14, mr: 0.5 }} />
                                    {format(new Date(task.dueDate), 'MMM d')}
                                </Box>
                            )}
                        </Box>

                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            {task.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                                {task.assignedTo?.map((user: any) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                                    <Avatar key={user._id} alt={`${user.firstName} ${user.lastName}`}>
                                        {user.firstName[0]}
                                    </Avatar>
                                ))}
                            </AvatarGroup>

                            <Box sx={{ display: 'flex', gap: 1, color: 'text.secondary' }}>
                                {task.attachments?.length > 0 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                                        <AttachFile sx={{ fontSize: 14, mr: 0.2 }} />
                                        {task.attachments.length}
                                    </Box>
                                )}
                                {task.comments?.length > 0 && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem' }}>
                                        <Comment sx={{ fontSize: 14, mr: 0.2 }} />
                                        {task.comments.length}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}
        </Draggable>
    );
}
