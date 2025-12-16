import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMilestone {
    name: string;
    dueDate: Date;
    completed: boolean;
}

export interface IProject extends Document {
    projectName: string;
    description: string;
    managerId: mongoose.Types.ObjectId;
    teamMembers: mongoose.Types.ObjectId[];
    startDate: Date;
    endDate: Date;
    status: 'active' | 'completed' | 'on-hold';
    priority: 'low' | 'medium' | 'high';
    deadline: Date;
    milestones: IMilestone[];
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>(
    {
        name: { type: String, required: true },
        dueDate: { type: Date, required: true },
        completed: { type: Boolean, default: false },
    },
    { _id: false }
);

const ProjectSchema = new Schema<IProject>(
    {
        projectName: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        managerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        teamMembers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'on-hold'], // Updated enum
            default: 'active', // Updated default
        },
        priority: { // Added
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        deadline: { // Added
            type: Date,
            required: true,
        },
        milestones: [MilestoneSchema],
        tags: [{ type: String }], // Added
    },
    {
        timestamps: true,
    }
);

const Project: Model<IProject> =
    mongoose.models.Project ||
    mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
