import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    adminReply: { type: String }, // Admin response text
    adminRepliedAt: { type: Date },
    isPublished: { type: Boolean, default: true },
}, {
    timestamps: true,
});

// Ensure a user can only review a product once per order
ReviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
