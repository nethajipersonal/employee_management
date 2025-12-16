import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const department = searchParams.get('department');
        const search = searchParams.get('search');

        const query: any = {};

        if (role) query.role = role;
        if (department) query.department = department;
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { employeeId: { $regex: search, $options: 'i' } },
            ];
        }

        const employees = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        return NextResponse.json(employees);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch employees' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const body = await request.json();

        // Check if employee ID or email already exists
        const existingUser = await User.findOne({
            $or: [{ email: body.email }, { employeeId: body.employeeId }],
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Employee with this email or ID already exists' },
                { status: 400 }
            );
        }

        // Create new user
        // Password will be hashed by pre-save hook
        const user = await User.create(body);
        const userObject = (user as any).toObject ? (user as any).toObject() : user;
        const { password, ...userWithoutPassword } = userObject;

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error: any) {
        console.error('Create employee error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create employee' },
            { status: 500 }
        );
    }
}
