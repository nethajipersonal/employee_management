import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const query: any = {};

        if (status && status !== 'all') query.status = status;
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Role-based filtering
        if (session.user.role === 'manager') {
            query.managerId = session.user.id;
        } else if (session.user.role === 'employee') {
            query.teamMembers = session.user.id;
        }

        const projects = await Project.find(query)
            .populate('managerId', 'firstName lastName')
            .populate('teamMembers', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'manager'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        const project = await Project.create({
            ...body,
            managerId: body.managerId || session.user.id,
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error: any) {
        console.error('Project creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create project' },
            { status: 500 }
        );
    }
}
