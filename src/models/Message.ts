import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage extends Document {
    sender: mongoose.Types.ObjectId;
    recipient?: mongoose.Types.ObjectId; // null for general channel or specific channel
    channelId?: mongoose.Types.ObjectId; // null for DM or General
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    channelId: {
        type: Schema.Types.ObjectId,
        ref: 'Channel',
        default: null,
    },
    content: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Message: Model<IMessage> =
    mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
