import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExpense extends Document {
    employeeId: mongoose.Types.ObjectId;
    amount: number;
    category: 'travel' | 'food' | 'accommodation' | 'supplies' | 'other';
    description: string;
    date: Date;
    receiptUrl?: string;
    status: 'pending' | 'approved' | 'rejected';
    approvedBy?: mongoose.Types.ObjectId;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
    {
        employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        amount: { type: Number, required: true },
        category: {
            type: String,
            enum: ['travel', 'food', 'accommodation', 'supplies', 'other'],
            required: true,
        },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        receiptUrl: { type: String },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        rejectionReason: { type: String },
    },
    { timestamps: true }
);

const Expense: Model<IExpense> =
    mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);

export default Expense;
