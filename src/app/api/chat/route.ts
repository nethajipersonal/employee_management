import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';
import Notification from '@/models/Notification';
import User from '@/models/User'; // Ensure User model is registered
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Ensure User model is loaded
        if (!mongoose.models.User) {
            console.log('User model not found in mongoose.models, ensuring it is loaded via import');
        }

        const { searchParams } = new URL(req.url);
        const recipientId = searchParams.get('recipientId');
        const channelId = searchParams.get('channelId');
        const currentUser = await User.findOne({ email: session.user.email });

        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let query = {};

        if (recipientId) {
            // Direct Message
            query = {
                $or: [
                    { sender: currentUser._id, recipient: recipientId },
                    { sender: recipientId, recipient: currentUser._id },
                ],
            };
        } else if (channelId) {
            // Channel Message
            query = { channelId: channelId };
        } else {
            // General Channel (Default) - messages with no recipient AND no channelId
            // OR explicitly channelId is null/undefined
            query = { recipient: null, channelId: null };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('sender', 'name email image')
            .lean();

        return NextResponse.json(messages.reverse());
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { content, recipientId, channelId } = await req.json();

        if (!content || typeof content !== 'string' || !content.trim()) {
            return NextResponse.json(
                { error: 'Message content is required' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const newMessage = await Message.create({
            sender: user._id,
            recipient: recipientId || null,
            channelId: channelId || null,
            content: content.trim(),
        });

        if (recipientId) {
            // Create notification for the recipient
            try {
                await Notification.create({
                    recipient: recipientId,
                    sender: user._id,
                    type: 'message',
                    referenceId: newMessage._id,
                });
            } catch (notifError) {
                console.error('Error creating notification:', notifError);
                // Don't fail the request if notification fails
            }
        }

        const populatedMessage = await newMessage.populate('sender', 'name email image');

        return NextResponse.json(populatedMessage, { status: 201 });
    } catch (error) {
        console.error('Error sending message:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }
}

import mongoose from 'mongoose';
