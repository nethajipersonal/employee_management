'use client';

import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import ChatSidebar from '@/components/Chat/ChatSidebar';
import ChatWindow from '@/components/Chat/ChatWindow';
import { useSearchParams } from 'next/navigation';

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

export default function ChatPage() {
    const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
    const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [channels, setChannels] = useState<Channel[]>([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/users');
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
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

        fetchUsers();
        fetchChannels();
    }, []);

    useEffect(() => {
        const recipientId = searchParams.get('recipientId');
        if (recipientId) {
            setSelectedRecipientId(recipientId);
            setSelectedChannelId(null);
        }
    }, [searchParams]);

    const handleSelectRecipient = (recipientId: string | null) => {
        setSelectedRecipientId(recipientId);
        setSelectedChannelId(null);
    }

    const handleSelectChannel = (channelId: string | null) => {
        setSelectedChannelId(channelId);
        setSelectedRecipientId(null);
    }

    const getRecipientName = () => {
        if (!selectedRecipientId) return undefined;
        const user = users.find(u => u._id === selectedRecipientId);
        return user ? user.name : 'Unknown User';
    }

    const getChannelName = () => {
        if (!selectedChannelId) return undefined;
        const channel = channels.find(c => c._id === selectedChannelId);
        return channel ? channel.name : 'Unknown Channel';
    }

    const isSidebarVisible = !isMobile || (selectedRecipientId === null && selectedChannelId === null);

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
            <Box sx={{
                width: isSidebarVisible ? (isMobile ? '100%' : 280) : 0,
                display: isSidebarVisible ? 'block' : 'none',
                flexShrink: 0
            }}>
                <ChatSidebar
                    selectedRecipientId={selectedRecipientId}
                    selectedChannelId={selectedChannelId}
                    onSelectRecipient={handleSelectRecipient}
                    onSelectChannel={handleSelectChannel}
                />
            </Box>
            <Box sx={{
                flexGrow: 1,
                display: (!isMobile || !isSidebarVisible) ? 'flex' : 'none',
                flexDirection: 'column'
            }}>
                <ChatWindow
                    recipientId={selectedRecipientId}
                    channelId={selectedChannelId}
                    recipientName={getRecipientName()}
                    channelName={getChannelName()}
                    onBack={() => {
                        setSelectedRecipientId(null);
                        setSelectedChannelId(null);
                    }}
                />
            </Box>
        </Box>
    );
}
