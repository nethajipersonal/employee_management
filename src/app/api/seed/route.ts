import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST() {
    try {
        await dbConnect();

        // Clear existing users to prevent duplicates and ensure clean state
        await User.deleteMany({});

        // Create demo users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt); // Default password for all

        const users = [
            {
                employeeId: 'EMP001',
                email: 'admin@company.com',
                password: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                department: 'IT',
                position: 'System Administrator',
                joiningDate: new Date('2020-01-01'),
                salary: {
                    basic: 80000,
                    allowances: {
                        hra: 20000,
                        transport: 5000,
                        medical: 3000,
                        other: 2000,
                    },
                    deductions: {
                        tax: 15000,
                        providentFund: 8000,
                        other: 0,
                    },
                },
                isActive: true,
            },
            {
                employeeId: 'EMP002',
                email: 'manager@company.com',
                password: await bcrypt.hash('manager123', salt),
                firstName: 'Manager',
                lastName: 'User',
                role: 'manager',
                department: 'Engineering',
                position: 'Engineering Manager',
                joiningDate: new Date('2021-03-15'),
                salary: {
                    basic: 60000,
                    allowances: {
                        hra: 15000,
                        transport: 4000,
                        medical: 2500,
                        other: 1500,
                    },
                    deductions: {
                        tax: 11000,
                        providentFund: 6000,
                        other: 0,
                    },
                },
                isActive: true,
            },
            {
                employeeId: 'EMP003',
                email: 'employee@company.com',
                password: await bcrypt.hash('employee123', salt),
                firstName: 'Employee',
                lastName: 'User',
                role: 'employee',
                department: 'Engineering',
                position: 'Software Engineer',
                joiningDate: new Date('2022-06-01'),
                salary: {
                    basic: 45000,
                    allowances: {
                        hra: 11000,
                        transport: 3000,
                        medical: 2000,
                        other: 1000,
                    },
                    deductions: {
                        tax: 8000,
                        providentFund: 4500,
                        other: 0,
                    },
                },
                isActive: true,
            },
        ];

        await User.insertMany(users);

        // Set manager relationship
        const manager = await User.findOne({ email: 'manager@company.com' });
        await User.findOneAndUpdate(
            { email: 'employee@company.com' },
            { managerId: manager?._id }
        );

        return NextResponse.json({
            message: 'Seed data created successfully',
            users: users.length,
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { error: 'Failed to seed database' },
            { status: 500 }
        );
    }
}
