import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Leave from '@/models/Leave';
import User from '@/models/User';
import { differenceInBusinessDays, parseISO } from 'date-fns';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const employeeId = searchParams.get('employeeId');

        const query: any = {};

        // If employee, only show own leaves
        if (session.user.role === 'employee') {
            query.employeeId = session.user.id;
        } else if (employeeId) {
            query.employeeId = employeeId;
        }

        if (status) query.status = status;

        const leaves = await Leave.find(query)
            .populate('employeeId', 'firstName lastName employeeId')
            .sort({ createdAt: -1 });

        return NextResponse.json(leaves);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch leaves' },
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
        const { type, startDate, endDate, reason } = body;

        const start = parseISO(startDate);
        const end = parseISO(endDate);
        const days = differenceInBusinessDays(end, start) + 1;

        if (days <= 0) {
            return NextResponse.json(
                { error: 'End date must be after start date' },
                { status: 400 }
            );
        }

        // Check leave balance
        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const balanceKey = type.toLowerCase() as keyof typeof user.leaveBalance;
        if (user.leaveBalance && user.leaveBalance[balanceKey] < days && type !== 'LOP') {
            return NextResponse.json(
                { error: `Insufficient ${type} leave balance. Available: ${user.leaveBalance[balanceKey]}` },
                { status: 400 }
            );
        }

        const leave = await Leave.create({
            employeeId: session.user.id,
            leaveType: type,
            startDate,
            endDate,
            reason,
            numberOfDays: days,
            status: 'pending',
        });

        return NextResponse.json(leave, { status: 201 });
    } catch (error: any) {
        console.error('Leave application error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to apply for leave' },
            { status: 500 }
        );
    }
}
