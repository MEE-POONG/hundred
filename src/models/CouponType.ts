
import mongoose from 'mongoose';

const couponTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        key: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
        },
        icon: {
            type: String, // Emoji or icon name
            default: '🎟️',
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

const CouponType = mongoose.models.CouponType || mongoose.model('CouponType', couponTypeSchema);

export default CouponType;
