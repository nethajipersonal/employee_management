import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Leave from '@/models/Leave';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'manager'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { status, comments } = await request.json();
        const { id } = await params;

        const leave = await Leave.findById(id);
        if (!leave) {
            return NextResponse.json({ error: 'Leave not found' }, { status: 404 });
        }

        if (leave.status !== 'pending') {
            return NextResponse.json(
                { error: 'Can only update pending leaves' },
                { status: 400 }
            );
        }

        leave.status = status;
        if (comments) leave.reviewComments = comments;
        leave.reviewedAt = new Date();

        if (status === 'approved') {
            leave.reviewedBy = new mongoose.Types.ObjectId(session.user.id);

            // Deduct balance if approved
            if (leave.leaveType !== 'unpaid') {
                const user = await User.findById(leave.employeeId);
                if (user) {
                    // Map leave type to balance key
                    const typeMap: Record<string, string> = {
                        'casual': 'casual',
                        'sick': 'sick',
                        'annual': 'annual'
                    };
                    const balanceKey = typeMap[leave.leaveType] as keyof typeof user.leaveBalance;

                    if (balanceKey && user.leaveBalance[balanceKey] >= leave.numberOfDays) {
                        user.leaveBalance[balanceKey] -= leave.numberOfDays;
                        await user.save();
                    } else if (balanceKey) {
                        return NextResponse.json(
                            { error: 'Insufficient leave balance to approve' },
                            { status: 400 }
                        );
                    }
                }
            }
        } else if (status === 'rejected') {
            leave.reviewedBy = new mongoose.Types.ObjectId(session.user.id);
        }
        await leave.save();

        return NextResponse.json(leave);
    } catch (error: any) {
        console.error('Leave update error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update leave' },
            { status: 500 }
        );
    }
}
