import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/Expense';

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
        const { id } = await params;
        const body = await request.json();

        // Only allow status updates (approve/reject)
        const updateData: any = {};
        if (body.status) {
            updateData.status = body.status;
            updateData.approvedBy = session.user.id;
            if (body.status === 'rejected' && body.rejectionReason) {
                updateData.rejectionReason = body.rejectionReason;
            }
        }

        const expense = await Expense.findByIdAndUpdate(id, updateData, {
            new: true,
        })
            .populate('employeeId', 'firstName lastName')
            .populate('approvedBy', 'firstName lastName');

        if (!expense) {
            return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
        }

        return NextResponse.json(expense);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Failed to update expense' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { id } = await params;

        const expense = await Expense.findById(id);

        if (!expense) {
            return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
        }

        // Only allow deletion if pending and owned by user, or if admin
        if (
            session.user.role !== 'admin' &&
            (expense.employeeId.toString() !== session.user.id || expense.status !== 'pending')
        ) {
            return NextResponse.json(
                { error: 'Cannot delete this expense' },
                { status: 403 }
            );
        }

        await Expense.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete expense' },
            { status: 500 }
        );
    }
}
