import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Task from '@/models/Task';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const projectId = searchParams.get('projectId');
        const status = searchParams.get('status');
        const assignee = searchParams.get('assignee');

        const query: any = {};

        if (projectId) query.projectId = projectId;
        if (status) query.status = status;
        if (assignee) query.assignedTo = assignee;

        // If employee, only show tasks assigned to them or in their projects
        // For simplicity, if projectId is provided, we assume access check is done at project level
        // If fetching all tasks, filter by assignment for employees
        if (session.user.role === 'employee' && !projectId) {
            query.assignedTo = session.user.id;
        }

        const tasks = await Task.find(query)
            .populate('assignedTo', 'firstName lastName')
            .populate('createdBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        const task: any = await Task.create({
            ...body,
            createdBy: session.user.id,
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'firstName lastName')
            .populate('createdBy', 'firstName lastName');

        return NextResponse.json(populatedTask, { status: 201 });
    } catch (error: any) {
        console.error('Task creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create task' },
            { status: 500 }
        );
    }
}
