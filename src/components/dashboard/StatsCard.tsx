'use client';

import { Paper, Box, Typography, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error';
    trend?: {
        value: number;
        label: string;
        isPositive: boolean;
    };
}

export default function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                height: '100%',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => `0 12px 24px -4px ${alpha(theme.palette[color].main, 0.15)}`,
                    borderColor: `${color}.main`,
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 3,
                        bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
                        color: `${color}.main`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {icon}
                </Box>
                {trend && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            bgcolor: (theme) => alpha(theme.palette[trend.isPositive ? 'success' : 'error'].main, 0.1),
                            color: trend.isPositive ? 'success.main' : 'error.main',
                            px: 1,
                            py: 0.5,
                            borderRadius: 20,
                        }}
                    >
                        {trend.isPositive ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                        <Typography variant="caption" fontWeight={600}>
                            {trend.value}%
                        </Typography>
                    </Box>
                )}
            </Box>

            <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
                {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {title}
            </Typography>

            {trend && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {trend.label}
                </Typography>
            )}
        </Paper>
    );
}
