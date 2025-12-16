import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    employeeId: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    dob?: Date;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    role: 'admin' | 'manager' | 'employee';
    department: string;
    position: string;
    joiningDate: Date;
    salary: {
        basic: number;
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
    };
    documents?: {
        idProof?: string;
        resume?: string;
        joiningLetter?: string;
    };
    leaveBalance: {
        casual: number;
        sick: number;
        annual: number;
    };
    managerId?: mongoose.Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        employeeId: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        dob: {
            type: Date,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        documents: {
            idProof: String,
            resume: String,
            joiningLetter: String,
        },
        role: {
            type: String,
            enum: ['admin', 'manager', 'employee'],
            default: 'employee',
        },
        department: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            required: true,
        },
        joiningDate: {
            type: Date,
            required: true,
        },
        salary: {
            basic: { type: Number, required: true, default: 0 },
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
        },
        leaveBalance: {
            casual: { type: Number, default: 12 },
            sick: { type: Number, default: 12 },
            annual: { type: Number, default: 15 },
        },
        managerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Hash password before saving
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
UserSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
