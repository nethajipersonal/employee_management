'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Box, Paper, Typography, useTheme } from '@mui/material';

const data = [
    { name: 'Mon', present: 20, absent: 4 },
    { name: 'Tue', present: 22, absent: 2 },
    { name: 'Wed', present: 21, absent: 3 },
    { name: 'Thu', present: 23, absent: 1 },
    { name: 'Fri', present: 19, absent: 5 },
];

export default function AttendanceChart() {
    const theme = useTheme();

    return (
        <Paper sx={{ p: 3, height: '100%', borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Weekly Attendance
            </Typography>
            <Box sx={{ height: 300, width: '100%', mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{
                                borderRadius: 8,
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Bar
                            dataKey="present"
                            name="Present"
                            fill={theme.palette.primary.main}
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                        />
                        <Bar
                            dataKey="absent"
                            name="Absent"
                            fill={theme.palette.error.light}
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}
