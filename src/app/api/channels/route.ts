import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Channel from '@/models/Channel';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const channels = await Channel.find().sort({ name: 1 }).lean();
        return NextResponse.json(channels);
    } catch (error) {
        console.error('Error fetching channels:', error);
        return NextResponse.json(
            { error: 'Failed to fetch channels' },
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

        // Ensure User model is loaded
        if (!mongoose.models.User) {
            console.log('User model not found in mongoose.models, ensuring it is loaded via import');
        }

        const { name, description } = await req.json();

        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json(
                { error: 'Channel name is required' },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if channel exists
        const existingChannel = await Channel.findOne({ name: name.trim() });
        if (existingChannel) {
            return NextResponse.json({ error: 'Channel already exists' }, { status: 400 });
        }

        const newChannel = await Channel.create({
            name: name.trim(),
            description: description?.trim(),
            createdBy: user._id,
        });

        return NextResponse.json(newChannel, { status: 201 });
    } catch (error) {
        console.error('Error creating channel:', error);
        return NextResponse.json(
            { error: 'Failed to create channel' },
            { status: 500 }
        );
    }
}
