import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Expense from '@/models/Expense';

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

        if (status && status !== 'all') query.status = status;

        // Role-based access
        if (session.user.role === 'employee') {
            // Employees only see their own expenses
            query.employeeId = session.user.id;
        } else if (employeeId) {
            // Admins/Managers can filter by employee
            query.employeeId = employeeId;
        }

        const expenses = await Expense.find(query)
            .populate('employeeId', 'firstName lastName email')
            .populate('approvedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json(expenses);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch expenses' },
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

        const expense = await Expense.create({
            ...body,
            employeeId: session.user.id,
            status: 'pending',
        });

        return NextResponse.json(expense, { status: 201 });
    } catch (error: any) {
        console.error('Expense creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to submit expense' },
            { status: 500 }
        );
    }
}
