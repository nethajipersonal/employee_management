import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILeave extends Document {
    employeeId: mongoose.Types.ObjectId;
    leaveType: 'casual' | 'sick' | 'annual' | 'unpaid';
    startDate: Date;
    endDate: Date;
    numberOfDays: number;
    reason: string;
    comments?: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    reviewComments?: string;
    createdAt: Date;
    updatedAt: Date;
}

const LeaveSchema = new Schema<ILeave>(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        leaveType: {
            type: String,
            enum: ['casual', 'sick', 'annual', 'unpaid'],
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        numberOfDays: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        comments: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        reviewedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reviewedAt: {
            type: Date,
        },
        reviewComments: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Leave: Model<ILeave> =
    mongoose.models.Leave || mongoose.model<ILeave>('Leave', LeaveSchema);

export default Leave;
