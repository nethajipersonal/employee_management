'use client';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Box, Paper, Typography, useTheme } from '@mui/material';

const data = [
    { name: 'Active', value: 8 },
    { name: 'Completed', value: 12 },
    { name: 'On Hold', value: 3 },
    { name: 'Planning', value: 5 },
];

export default function ProjectChart() {
    const theme = useTheme();

    const COLORS = [
        theme.palette.success.main,
        theme.palette.primary.main,
        theme.palette.warning.main,
        theme.palette.info.main,
    ];

    return (
        <Paper sx={{ p: 3, height: '100%', borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                Project Distribution
            </Typography>
            <Box sx={{ height: 300, width: '100%', mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: 8,
                                border: 'none',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}
