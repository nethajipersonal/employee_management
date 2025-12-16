import ActivityLog from '@/models/ActivityLog';
import dbConnect from '@/lib/mongodb';

interface LogActivityParams {
    userId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    details?: string;
    ipAddress?: string;
}

export async function logActivity({
    userId,
    action,
    resourceType,
    resourceId,
    details,
    ipAddress,
}: LogActivityParams) {
    try {
        await dbConnect();
        await ActivityLog.create({
            userId,
            action,
            resourceType,
            resourceId,
            details,
            ipAddress,
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
        // Don't throw error to prevent disrupting the main flow
    }
}
