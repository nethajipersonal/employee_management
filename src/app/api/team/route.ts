import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Project from '@/models/Project';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'manager'].includes(session.user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // For managers, fetch employees in their department OR assigned to their projects
        // For simplicity in this demo, we'll fetch all employees if admin, 
        // or employees in the same department if manager.
        // A more complex logic would involve checking project assignments.

        const currentUser = await User.findById(session.user.id);
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        let query: any = { role: 'employee' };

        if (session.user.role === 'manager') {
            // Option 1: Same department
            if (currentUser.department) {
                query.department = currentUser.department;
            }

            // Option 2: Or assigned to projects managed by this user
            // This is a bit more complex to query efficiently in one go without aggregation
            // Let's stick to Department + explicitly assigned logic if we had a direct "reportsTo" field
            // For now, Department based is a good start for "My Team"
        }

        const team = await User.find(query)
            .select('-password') // Exclude password
            .sort({ firstName: 1 });

        return NextResponse.json(team);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch team' },
            { status: 500 }
        );
    }
}
