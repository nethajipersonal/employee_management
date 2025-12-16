import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayslip extends Document {
    employeeId: mongoose.Types.ObjectId;
    month: number;
    year: number;
    basicSalary: number;
    allowances: {
        hra: number;
        transport: number;
        medical: number;
        other: number;
    };
    deductions: {
        tax: number;
        providentFund: number;
        other: number;
    };
    grossSalary: number;
    netSalary: number;
    paidDate?: Date;
    status: 'generated' | 'paid';
    createdAt: Date;
    updatedAt: Date;
}

const PayslipSchema = new Schema<IPayslip>(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },
        year: {
            type: Number,
            required: true,
        },
        basicSalary: {
            type: Number,
            required: true,
        },
        allowances: {
            hra: { type: Number, default: 0 },
            transport: { type: Number, default: 0 },
            medical: { type: Number, default: 0 },
            other: { type: Number, default: 0 },
        },
        deductions: {
            tax: { type: Number, default: 0 },
            providentFund: { type: Number, default: 0 },
            other: { type: Number, default: 0 },
        },
        grossSalary: {
            type: Number,
            required: true,
        },
        netSalary: {
            type: Number,
            required: true,
        },
        paidDate: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['generated', 'paid'],
            default: 'generated',
        },
    },
    {
        timestamps: true,
    }
);

// Index for unique payslip per employee per month
PayslipSchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

const Payslip: Model<IPayslip> =
    mongoose.models.Payslip ||
    mongoose.model<IPayslip>('Payslip', PayslipSchema);

export default Payslip;
