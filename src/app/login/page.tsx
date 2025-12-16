'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Alert,
    CircularProgress,
    Grid,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { LoginOutlined, BubbleChart, Security, Speed } from '@mui/icons-material';

export default function LoginPage() {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/dashboard');
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex' }}>
            {!isMobile && (
                <Box
                    sx={{
                        flex: 1,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        p: 4,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: 0.1,
                            backgroundImage: 'radial-gradient(circle at 20% 20%, white 0%, transparent 20%), radial-gradient(circle at 80% 80%, white 0%, transparent 20%)',
                            backgroundSize: '100% 100%',
                        }}
                    />
                    <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 480, textAlign: 'center' }}>
                        <Typography variant="h2" fontWeight={800} gutterBottom>
                            Welcome Back
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 6, opacity: 0.9 }}>
                            Manage your workforce efficiently with our comprehensive solution.
                        </Typography>

                        <Grid container spacing={4} justifyContent="center">
                            <Grid item>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)' }}>
                                        <BubbleChart fontSize="large" />
                                    </Box>
                                    <Typography variant="body2" fontWeight={600}>Analytics</Typography>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)' }}>
                                        <Security fontSize="large" />
                                    </Box>
                                    <Typography variant="body2" fontWeight={600}>Secure</Typography>
                                </Box>
                            </Grid>
                            <Grid item>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.15)' }}>
                                        <Speed fontSize="large" />
                                    </Box>
                                    <Typography variant="body2" fontWeight={600}>Fast</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            )}

            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'background.default',
                    p: 4,
                }}
            >
                <Container maxWidth="xs">
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                bgcolor: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                mx: 'auto',
                                mb: 2,
                                boxShadow: '0 8px 24px rgba(99, 102, 241, 0.25)',
                            }}
                        >
                            <LoginOutlined fontSize="large" />
                        </Box>
                        <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
                            Sign In
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Enter your credentials to continue
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            sx={{ mb: 2.5 }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            sx={{ mb: 4 }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                mb: 4,
                                height: 48,
                                fontSize: '1rem',
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                        </Button>
                    </form>

                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            borderStyle: 'dashed',
                        }}
                    >
                        <Typography variant="subtitle2" gutterBottom color="text.primary" fontWeight={600}>
                            Demo Credentials
                        </Typography>
                        <Box sx={{ display: 'grid', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Admin</Typography>
                                <Typography variant="caption" fontWeight={500}>admin@company.com / admin123</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Manager</Typography>
                                <Typography variant="caption" fontWeight={500}>manager@company.com / manager123</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary">Employee</Typography>
                                <Typography variant="caption" fontWeight={500}>employee@company.com / employee123</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );
}
