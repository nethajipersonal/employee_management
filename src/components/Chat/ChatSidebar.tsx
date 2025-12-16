'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Typography,
    Avatar,
    Divider,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';
import {
    Tag as TagIcon,
    Person as PersonIcon,
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    name: string;
    email: string;
    image?: string;
}

interface Channel {
    _id: string;
    name: string;
}

interface ChatSidebarProps {
    selectedRecipientId: string | null;
    selectedChannelId: string | null;
    onSelectRecipient: (recipientId: string | null) => void;
    onSelectChannel: (channelId: string | null) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    selectedRecipientId,
    selectedChannelId,
    onSelectRecipient,
    onSelectChannel,
}) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');
    const [newChannelDesc, setNewChannelDesc] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.filter((u: User) => u.email !== session?.user?.email));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchChannels = async () => {
        try {
            const res = await fetch('/api/channels');
            if (res.ok) {
                const data = await res.json();
                setChannels(data);
            }
        } catch (error) {
            console.error('Error fetching channels:', error);
        }
    };

    useEffect(() => {
        if (session) {
            fetchUsers();
            fetchChannels();
        }
    }, [session]);

    const handleCreateChannel = async () => {
        if (!newChannelName.trim()) return;

        try {
            const res = await fetch('/api/channels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newChannelName,
                    description: newChannelDesc,
                }),
            });

            if (res.ok) {
                const newChannel = await res.json();
                setChannels([...channels, newChannel]);
                setIsCreateChannelOpen(false);
                setNewChannelName('');
                setNewChannelDesc('');
                onSelectChannel(newChannel._id);
            } else {
                // Handle error (e.g. duplicate name)
                console.error('Failed to create channel');
            }
        } catch (error) {
            console.error('Error creating channel:', error);
        }
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: 280,
                height: '100%',
                borderRight: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
            }}
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => router.back()}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Team Chat
                </Typography>
            </Box>
            <Divider />

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {/* Channels Section */}
                <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="overline" color="text.secondary">Channels</Typography>
                    <IconButton size="small" onClick={() => setIsCreateChannelOpen(true)}>
                        <AddIcon fontSize="small" />
                    </IconButton>
                </Box>
                <List disablePadding>
                    <ListItem disablePadding>
                        <ListItemButton
                            selected={selectedRecipientId === null && selectedChannelId === null}
                            onClick={() => onSelectChannel(null)}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <TagIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="general" />
                        </ListItemButton>
                    </ListItem>
                    {channels.map((channel) => (
                        <ListItem key={channel._id} disablePadding>
                            <ListItemButton
                                selected={selectedChannelId === channel._id}
                                onClick={() => onSelectChannel(channel._id)}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <TagIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={channel.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ my: 1 }} />

                {/* DMs Section */}
                <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="overline" color="text.secondary">Direct Messages</Typography>
                </Box>
                <List disablePadding>
                    {users.map((user) => (
                        <ListItem key={user._id} disablePadding>
                            <ListItemButton
                                selected={selectedRecipientId === user._id}
                                onClick={() => onSelectRecipient(user._id)}
                            >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Avatar
                                        src={user.image}
                                        alt={user.name}
                                        sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
                                    >
                                        {(user.name || 'U').charAt(0)}
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText
                                    primary={user.name || 'Unknown User'}
                                    primaryTypographyProps={{
                                        noWrap: true,
                                        variant: 'body2'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Create Channel Dialog */}
            <Dialog open={isCreateChannelOpen} onClose={() => setIsCreateChannelOpen(false)}>
                <DialogTitle>Create New Channel</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Channel Name"
                        fullWidth
                        variant="outlined"
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        placeholder="e.g. marketing"
                    />
                    <TextField
                        margin="dense"
                        label="Description (Optional)"
                        fullWidth
                        variant="outlined"
                        value={newChannelDesc}
                        onChange={(e) => setNewChannelDesc(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreateChannelOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateChannel} variant="contained" disabled={!newChannelName.trim()}>Create</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default ChatSidebar;
