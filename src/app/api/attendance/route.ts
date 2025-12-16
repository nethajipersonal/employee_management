import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import TimeLog from '@/models/TimeLog';
import { startOfDay, endOfDay, differenceInHours, differenceInMinutes } from 'date-fns';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const employeeId = searchParams.get('employeeId');

        const query: any = {};

        // If not admin/manager, restrict to own data
        if (session.user.role === 'employee') {
            query.employeeId = session.user.id;
        } else if (employeeId) {
            query.employeeId = employeeId;
        }

        if (date) {
            const queryDate = new Date(date);
            query.date = {
                $gte: startOfDay(queryDate),
                $lte: endOfDay(queryDate),
            };
        }

        const logs = await TimeLog.find(query)
            .populate('employeeId', 'firstName lastName employeeId')
            .sort({ date: -1 });

        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch attendance logs' },
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
        const { action, notes } = await request.json(); // action: 'clock-in' | 'clock-out'

        const today = startOfDay(new Date());
        const userId = session.user.id;

        // Find today's log
        let timeLog = await TimeLog.findOne({
            employeeId: userId,
            date: {
                $gte: today,
                $lte: endOfDay(today),
            },
        });

        if (action === 'clock-in') {
            if (timeLog) {
                return NextResponse.json(
                    { error: 'Already clocked in for today' },
                    { status: 400 }
                );
            }

            // Check if late (e.g., after 10 AM)
            const now = new Date();
            const isLate = now.getHours() >= 10;

            timeLog = await TimeLog.create({
                employeeId: userId,
                date: now,
                clockIn: now,
                status: isLate ? 'late' : 'present',
                notes,
            });
        } else if (action === 'clock-out') {
            if (!timeLog) {
                return NextResponse.json(
                    { error: 'You must clock in first' },
                    { status: 400 }
                );
            }

            if (timeLog.clockOut) {
                return NextResponse.json(
                    { error: 'Already clocked out for today' },
                    { status: 400 }
                );
            }

            const now = new Date();
            const hours = differenceInHours(now, new Date(timeLog.clockIn!));
            const minutes = differenceInMinutes(now, new Date(timeLog.clockIn!)) % 60;

            timeLog.clockOut = now;
            timeLog.totalHours = parseFloat(`${hours}.${Math.floor((minutes / 60) * 100)}`);
            timeLog.isLocked = true; // Lock after clock out
            timeLog.lockedAt = now;

            if (notes) timeLog.notes = notes;

            await timeLog.save();
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json(timeLog);
    } catch (error: any) {
        console.error('Attendance error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process attendance' },
            { status: 500 }
        );
    }
}
