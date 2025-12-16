import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    type: string; // 'message', etc.
    referenceId?: mongoose.Types.ObjectId; // ID of the message
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['message'],
    },
    referenceId: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Notification: Model<INotification> =
    mongoose.models.Notification ||
    mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
