import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
    userId: mongoose.Types.ObjectId;
    action: string;
    resourceType: string; // e.g., 'project', 'employee', 'expense'
    resourceId?: mongoose.Types.ObjectId;
    details: string;
    ipAddress?: string;
    createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        action: { type: String, required: true },
        resourceType: { type: String, required: true },
        resourceId: { type: Schema.Types.ObjectId },
        details: { type: String },
        ipAddress: { type: String },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

const ActivityLog: Model<IActivityLog> =
    mongoose.models.ActivityLog ||
    mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;
