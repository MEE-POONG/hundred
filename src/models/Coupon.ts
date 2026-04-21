
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CouponType',
            required: true,
        },
        description: {
            type: String,
        },
        discountType: {
            type: String,
            enum: ['fixed', 'percent'],
            default: 'fixed',
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        minPurchase: {
            type: Number,
            default: 0,
        },
        expirationDate: {
            type: Date,
        },
        usageLimit: {
            type: Number,
            default: null, // null means unlimited
        },
        usedCount: {
            type: Number,
            default: 0,
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

const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);

export default Coupon;
