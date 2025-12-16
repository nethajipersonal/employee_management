import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
    title: string;
    description?: string;
    projectId: mongoose.Types.ObjectId;
    assignedTo?: mongoose.Types.ObjectId[];
    status: 'todo' | 'in-progress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate?: Date;
    attachments?: string[];
    comments?: {
        userId: mongoose.Types.ObjectId;
        text: string;
        createdAt: Date;
    }[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String },
        projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
        assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'review', 'done'],
            default: 'todo',
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        dueDate: { type: Date },
        attachments: [{ type: String }],
        comments: [
            {
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                text: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

const Task: Model<ITask> =
    mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
