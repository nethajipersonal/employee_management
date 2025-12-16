'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
    Switch,
    Container,
    useTheme,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    EventNote as EventNoteIcon,
    ReceiptLongOutlined,
    AccessTime as AccessTimeIcon,
    Logout as LogoutIcon,
    AccountCircleOutlined as AccountCircleIcon,
    Settings as SettingsIcon,
    DarkModeOutlined,
    LightModeOutlined,
    AttachMoney as AttachMoneyIcon,
    WorkOutline as WorkIcon,
    History as HistoryIcon,
    Chat as ChatIcon,
} from '@mui/icons-material';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { alpha } from '@mui/material/styles';
import { useThemeContext } from '@/contexts/ThemeContext';

const drawerWidth = 260;
const collapsedDrawerWidth = 72;

interface NavItem {
    title: string;
    icon: React.ReactNode;
    path: string;
    roles: string[];
}

const navigationItems: NavItem[] = [
    {
        title: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard',
        roles: ['admin', 'manager', 'employee'],
    },
    {
        title: 'Employees',
        icon: <PeopleIcon />,
        path: '/admin/employees',
        roles: ['admin'],
    },
    {
        title: 'Attendance',
        icon: <AccessTimeIcon />,
        path: '/timetrack',
        roles: ['admin', 'manager', 'employee'],
    },
    {
        title: 'Leaves',
        icon: <EventNoteIcon />,
        path: '/leaves',
        roles: ['admin', 'manager', 'employee'],
    },
    {
        title: 'Payroll',
        icon: <AttachMoneyIcon />,
        path: '/payslips',
        roles: ['admin', 'manager', 'employee'],
    },
    {
        title: 'Projects',
        icon: <WorkIcon />,
        path: '/projects',
        roles: ['admin', 'manager', 'employee'],
    },
    {
        title: 'Expenses',
        icon: <ReceiptLongOutlined />,
        path: '/expenses',
        roles: ['admin', 'manager', 'employee'],
    },
    {
        title: 'Activity',
        icon: <HistoryIcon />,
        path: '/admin/activity',
        roles: ['admin'],
    },
    {
        title: 'Chat',
        icon: <ChatIcon />,
        path: '/chat',
        roles: ['admin', 'manager', 'employee'],
    },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();


    const {
        mode,
        toggleMode,
        primaryColor,
        setPrimaryColor,
        sidebarOpen,
        toggleSidebar
    } = useThemeContext();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await signOut({ redirect: true, callbackUrl: '/login' });
    };

    const filteredNavItems = navigationItems.filter(item =>
        item.roles.includes(session?.user?.role || '')
    );

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1A2027', color: '#fff' }}>
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: [2.5],
                    minHeight: '80px !important',
                }}
            >
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>E</Avatar>
                <Typography variant="h6" noWrap fontWeight={700} sx={{ letterSpacing: 1 }}>
                    EMS PRO
                </Typography>
            </Toolbar>

            <Box sx={{ px: 2, py: 2, flexGrow: 1 }}>
                <Typography variant="caption" sx={{ px: 2, mb: 1, display: 'block', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: 0.5 }}>
                    MAIN MENU
                </Typography>
                <List>
                    {filteredNavItems.map(item => (
                        <ListItem key={item.title} disablePadding sx={{ mb: 1, display: 'block' }}>
                            <Tooltip title={!sidebarOpen ? item.title : ''} placement="right">
                                <ListItemButton
                                    onClick={() => router.push(item.path)}
                                    selected={pathname === item.path}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: sidebarOpen ? 'initial' : 'center',
                                        px: 2.5,
                                        borderRadius: '12px',
                                        transition: 'all 0.2s ease-in-out',
                                        color: 'rgba(255,255,255,0.7)',
                                        '&.Mui-selected': {
                                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.6)} 100%)`,
                                            color: '#fff',
                                            boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.24)}`,
                                            '&:hover': {
                                                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
                                            },
                                            '& .MuiListItemIcon-root': {
                                                color: '#fff',
                                            },
                                        },
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.08)',
                                            color: '#fff',
                                            '& .MuiListItemIcon-root': {
                                                color: '#fff',
                                            },
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: sidebarOpen ? 2 : 'auto',
                                            justifyContent: 'center',
                                            color: 'inherit',
                                            transition: 'color 0.2s',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.title}
                                        sx={{ opacity: sidebarOpen ? 1 : 0 }}
                                        primaryTypographyProps={{
                                            fontWeight: pathname === item.path ? 600 : 500,
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Bottom Profile Section */}
            <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1,
                        borderRadius: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                    }}
                    onClick={handleProfileMenuOpen}
                >
                    <Avatar
                        sx={{ width: 40, height: 40, bgcolor: 'secondary.main', mr: sidebarOpen ? 2 : 0 }}
                    >
                        {session?.user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    {sidebarOpen && (
                        <Box sx={{ overflow: 'hidden' }}>
                            <Typography variant="subtitle2" noWrap sx={{ color: '#fff', fontWeight: 600 }}>
                                {session?.user?.name || 'User'}
                            </Typography>
                            <Typography variant="caption" noWrap sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                {session?.user?.role || 'Role'}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px)` },
                    ml: { sm: `${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px` },
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={toggleSidebar}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Breadcrumbs or Page Title could go here */}
                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton color="inherit" onClick={() => setSettingsOpen(true)}>
                            <SettingsIcon />
                        </IconButton>
                        {/* Profile Menu is now in sidebar, but keeping a logout/settings here or just settings is fine. 
                            Let's keep the menu logic but trigger from sidebar profile mostly, 
                            though top bar usually has notifications/settings.
                        */}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Settings Drawer (unchanged) */}
            <Drawer
                anchor="right"
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                PaperProps={{ sx: { width: 300, p: 3 } }}
            >
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Settings
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Mode
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'action.hover', p: 1, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {mode === 'dark' ? <DarkModeOutlined /> : <LightModeOutlined />}
                            <Typography>{mode === 'dark' ? 'Dark' : 'Light'}</Typography>
                        </Box>
                        <Switch checked={mode === 'dark'} onChange={toggleMode} />
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Theme Color
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {['indigo', 'blue', 'purple', 'green', 'orange', 'red'].map((color) => (
                            <Box
                                key={color}
                                onClick={() => setPrimaryColor(color as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    bgcolor: `${color === 'indigo' ? '#6366f1' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#8b5cf6' : color === 'green' ? '#10b981' : color === 'orange' ? '#f59e0b' : '#ef4444'}`,
                                    cursor: 'pointer',
                                    border: primaryColor === color ? '3px solid white' : 'none',
                                    boxShadow: primaryColor === color ? '0 0 0 2px #6366f1' : 'none',
                                    transition: 'all 0.2s',
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            </Drawer>

            <Box
                component="nav"
                sx={{
                    width: { sm: sidebarOpen ? drawerWidth : collapsedDrawerWidth },
                    flexShrink: { sm: 0 },
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            bgcolor: '#1A2027', // Match sidebar color
                            color: '#fff',
                            borderRight: 'none',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
                            overflowX: 'hidden',
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                            bgcolor: '#1A2027', // Match sidebar color
                            color: '#fff',
                            borderRight: 'none',
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${sidebarOpen ? drawerWidth : collapsedDrawerWidth}px)` },
                    bgcolor: 'background.default',
                    minHeight: '100vh',
                    transition: theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                }}
            >
                <Toolbar />
                <Container maxWidth={false} sx={{ mt: 2, mb: 2 }}>
                    <Breadcrumbs />
                </Container>
                {children}
            </Box>

            {/* Profile Menu (reused) */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'bottom' }} // Adjusted for bottom profile
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
                <MenuItem onClick={handleProfileMenuClose}>
                    <ListItemIcon>
                        <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}


