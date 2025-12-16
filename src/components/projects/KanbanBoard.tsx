'use client';

import { Box, Typography, Paper } from '@mui/material';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
    tasks: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    onTaskMove: (taskId: string, newStatus: string) => void;
    onTaskClick: (task: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const COLUMNS = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    review: 'Review',
    done: 'Done',
};

export default function KanbanBoard({ tasks, onTaskMove, onTaskClick }: KanbanBoardProps) {
    const getTasksByStatus = (status: string) => {
        return tasks.filter(task => task.status === status);
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        onTaskMove(draggableId, destination.droppableId);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2, minHeight: 'calc(100vh - 200px)' }}>
                {Object.entries(COLUMNS).map(([status, title]) => (
                    <Box key={status} sx={{ minWidth: 280, width: 280, display: 'flex', flexDirection: 'column' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                bgcolor: 'background.default',
                                borderRadius: 2,
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                {title}
                                <Typography component="span" variant="caption" sx={{ bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>
                                    {getTasksByStatus(status).length}
                                </Typography>
                            </Typography>

                            <Droppable droppableId={status}>
                                {(provided, snapshot) => (
                                    <Box
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        sx={{
                                            flexGrow: 1,
                                            minHeight: 100,
                                            transition: 'background-color 0.2s ease',
                                            bgcolor: snapshot.isDraggingOver ? 'action.selected' : 'transparent',
                                            borderRadius: 1,
                                        }}
                                    >
                                        {getTasksByStatus(status).map((task, index) => (
                                            <TaskCard
                                                key={task._id}
                                                task={task}
                                                index={index}
                                                onClick={onTaskClick}
                                            />
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </Paper>
                    </Box>
                ))}
            </Box>
        </DragDropContext>
    );
}
