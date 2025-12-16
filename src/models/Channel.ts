import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChannel extends Document {
    name: string;
    description?: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const ChannelSchema: Schema<IChannel> = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Channel: Model<IChannel> =
    mongoose.models.Channel || mongoose.model<IChannel>('Channel', ChannelSchema);

export default Channel;
