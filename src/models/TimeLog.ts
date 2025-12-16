import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITimeLog extends Document {
    employeeId: mongoose.Types.ObjectId;
    date: Date;
    clockIn?: Date;
    clockOut?: Date;
    totalHours: number;
    status: 'present' | 'late' | 'half-day' | 'absent';
    isLocked: boolean;
    lockedAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TimeLogSchema = new Schema<ITimeLog>(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        clockIn: {
            type: Date,
        },
        clockOut: {
            type: Date,
        },
        totalHours: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['present', 'late', 'half-day', 'absent'],
            default: 'present',
        },
        isLocked: {
            type: Boolean,
            default: false,
        },
        lockedAt: {
            type: Date,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for unique time log per employee per day
TimeLogSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const TimeLog: Model<ITimeLog> =
    mongoose.models.TimeLog ||
    mongoose.model<ITimeLog>('TimeLog', TimeLogSchema);

export default TimeLog;
