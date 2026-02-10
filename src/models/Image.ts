import mongoose, { Schema, Document } from 'mongoose';

export interface IImage extends Document {
    filename: string;
    contentType: string;
    data: Buffer;
    size: number;
    uploadedBy: string;
    createdAt: Date;
}

const ImageSchema = new Schema<IImage>({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: String, default: 'admin' },
}, {
    timestamps: true,
});

export default mongoose.models.Image || mongoose.model<IImage>('Image', ImageSchema);
