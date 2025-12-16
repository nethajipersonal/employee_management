'use client';

import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Box,
    Avatar,
    Divider,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    Chat as ChatIcon,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Notification {
    _id: string;
    sender: {
        _id: string;
        name?: string;
        image?: string;
    };
    type: string;
    isRead: boolean;
    createdAt: string;
}

const NotificationBell = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [prevCount, setPrevCount] = useState(0);



    useEffect(() => {
        if (session) {
            const fetchNotifications = async () => {
                try {
                    const res = await fetch('/api/notifications');
                    if (res.ok) {
                        const data = await res.json();
                        setNotifications(data);
                        if (data.length > prevCount && data.length > 0) {
                            setSnackbarOpen(true);
                        }
                        setPrevCount(data.length);
                    }
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                }
            };
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 10000);
            return () => clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleNotificationClick = async (notification: Notification) => {
        handleClose();

        // Mark as read
        try {
            await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationIds: [notification._id] }),
            });
            // Optimistically update UI
            setNotifications((prev) => prev.filter((n) => n._id !== notification._id));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }

        // Navigate
        if (notification.type === 'message') {
            router.push(`/chat?recipientId=${notification.sender._id}`);
        }
    };

    if (!session) return null;

    return (
        <>
            <IconButton color="inherit" onClick={handleOpen}>
                <Badge badgeContent={notifications.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                    sx: { width: 320, maxHeight: 400 },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, pb: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Notifications
                    </Typography>
                </Box>
                <Divider />
                {notifications.length === 0 ? (
                    <MenuItem disabled>
                        <ListItemText primary="No new notifications" />
                    </MenuItem>
                ) : (
                    notifications.map((notification) => (
                        <MenuItem
                            key={notification._id}
                            onClick={() => handleNotificationClick(notification)}
                            sx={{ py: 1.5 }}
                        >
                            <ListItemIcon>
                                <Avatar
                                    src={notification.sender?.image}
                                    alt={notification.sender?.name || 'User'}
                                    sx={{ width: 32, height: 32 }}
                                >
                                    {(notification.sender?.name || 'U').charAt(0)}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography variant="body2" fontWeight="medium">
                                        {notification.sender?.name || 'Unknown User'}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="caption" color="text.secondary">
                                        Sent you a message • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Typography>
                                }
                            />
                            {notification.type === 'message' && (
                                <ChatIcon fontSize="small" color="action" sx={{ ml: 1 }} />
                            )}
                        </MenuItem>
                    ))
                )}
            </Menu>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
                    You have {notifications.length} unread notification{notifications.length > 1 ? 's' : ''}
                </Alert>
            </Snackbar>
        </>
    );
};

export default NotificationBell;
