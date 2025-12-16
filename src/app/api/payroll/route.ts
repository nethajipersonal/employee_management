import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Payslip from '@/models/Payslip';
import User from '@/models/User';
import TimeLog from '@/models/TimeLog';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(request.url);
        const month = searchParams.get('month');
        const year = searchParams.get('year');
        const employeeId = searchParams.get('employeeId');

        const query: any = {};

        if (session.user.role === 'employee') {
            query.employeeId = session.user.id;
        } else if (employeeId) {
            query.employeeId = employeeId;
        }

        if (month && year) {
            query.month = parseInt(month);
            query.year = parseInt(year);
        }

        const payslips = await Payslip.find(query)
            .populate('employeeId', 'firstName lastName employeeId department position')
            .sort({ year: -1, month: -1 });

        return NextResponse.json(payslips);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch payslips' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const { month, year, employeeId } = await request.json();

        // If employeeId provided, generate for one, else for all active
        const query = employeeId ? { _id: employeeId } : { isActive: true };
        const employees = await User.find(query);

        const generatedPayslips = [];

        for (const employee of employees) {
            // Check if already exists
            const existing = await Payslip.findOne({
                employeeId: employee._id,
                month,
                year,
            });

            if (existing) continue;

            // Calculate salary based on attendance (simplified logic)
            // In real app, fetch attendance days, calculate LOP, etc.

            const basic = employee.salary.basic;
            const hra = employee.salary.allowances.hra;
            const transport = employee.salary.allowances.transport;
            const medical = employee.salary.allowances.medical;
            const otherAllowances = employee.salary.allowances.other;

            const totalEarnings = basic + hra + transport + medical + otherAllowances;

            const tax = employee.salary.deductions.tax;
            const pf = employee.salary.deductions.providentFund;
            const otherDeductions = employee.salary.deductions.other;

            const totalDeductions = tax + pf + otherDeductions;
            const netSalary = totalEarnings - totalDeductions;

            const payslip = await Payslip.create({
                employeeId: employee._id,
                month,
                year,
                basicSalary: basic,
                allowances: {
                    hra,
                    transport,
                    medical,
                    other: otherAllowances
                },
                deductions: {
                    tax,
                    providentFund: pf,
                    other: otherDeductions
                },
                grossSalary: totalEarnings,
                netSalary,
                status: 'paid',
            });

            generatedPayslips.push(payslip);
        }

        return NextResponse.json({
            message: `Generated ${generatedPayslips.length} payslips`,
            count: generatedPayslips.length,
        });
    } catch (error: any) {
        console.error('Payroll generation error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate payroll' },
            { status: 500 }
        );
    }
}
