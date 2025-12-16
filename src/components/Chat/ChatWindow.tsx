'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Avatar,
    CircularProgress,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Send as SendIcon,
    Tag as TagIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';

interface Message {
    _id: string;
    sender: {
        _id: string;
        name: string;
        email: string;
        image?: string;
    };
    content: string;
    createdAt: string;
}

interface ChatWindowProps {
    recipientId: string | null;
    channelId: string | null;
    recipientName?: string;
    channelName?: string;
    onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    recipientId,
    channelId,
    recipientName,
    channelName,
    onBack
}) => {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            let query = '';
            if (recipientId) {
                query = `?recipientId=${recipientId}`;
            } else if (channelId) {
                query = `?channelId=${channelId}`;
            }
            // If neither, it fetches general channel by default (handled by API)

            const res = await fetch(`/api/chat${query}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipientId, channelId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !session) return;

        setIsSending(true);
        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: newMessage,
                    recipientId: recipientId,
                    channelId: channelId
                }),
            });

            if (res.ok) {
                setNewMessage('');
                await fetchMessages();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    if (!session) return null;
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                {isMobile && onBack && (
                    <IconButton onClick={onBack} edge="start" sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                )}
                {recipientId ? (
                    <Avatar sx={{ width: 32, height: 32 }}>{recipientName?.charAt(0)}</Avatar>
                ) : (
                    <TagIcon color="action" />
                )}
                <Typography variant="h6">
                    {recipientId ? recipientName : (channelId ? channelName : 'general')}
                </Typography>
            </Box>

            {/* Messages Area */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 3,
                    bgcolor: theme.palette.background.default,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {messages.length === 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
                        <Typography variant="body1">
                            No messages yet in {recipientId ? recipientName : (channelId ? `#${channelName}` : '#general')}.
                        </Typography>
                        <Typography variant="body2">Start the conversation!</Typography>
                    </Box>
                )}
                {messages.map((msg) => {
                    const isMe = msg.sender.email === session.user?.email;
                    return (
                        <Box
                            key={msg._id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isMe ? 'flex-end' : 'flex-start',
                                maxWidth: '70%',
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    {isMe ? 'You' : msg.sender.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            </Box>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    bgcolor: isMe ? 'primary.main' : 'background.paper',
                                    color: isMe ? 'primary.contrastText' : 'text.primary',
                                    borderRadius: 2,
                                    borderTopRightRadius: isMe ? 0 : 2,
                                    borderTopLeftRadius: !isMe ? 0 : 2,
                                    boxShadow: 1
                                }}
                            >
                                <Typography variant="body1">{msg.content}</Typography>
                            </Paper>
                        </Box>
                    );
                })}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    gap: 1,
                }}
            >
                <TextField
                    fullWidth
                    placeholder={`Message ${recipientId ? recipientName : (channelId ? `#${channelName}` : '#general')}`}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isSending}
                    autoComplete="off"
                    variant="outlined"
                    size="medium"
                />
                <IconButton
                    color="primary"
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    sx={{ width: 56, height: 56 }}
                >
                    {isSending ? <CircularProgress size={24} /> : <SendIcon />}
                </IconButton>
            </Box>
        </Box>
    );
};

export default ChatWindow;
