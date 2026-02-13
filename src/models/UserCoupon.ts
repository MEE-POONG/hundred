
import mongoose, { Schema, Document } from 'mongoose';

export interface IUserCoupon extends Document {
    user: mongoose.Types.ObjectId;
    coupon: mongoose.Types.ObjectId;
    isUsed: boolean;
    collectedAt: Date;
    usedAt?: Date;
    orderId?: mongoose.Types.ObjectId; // Link to order when used
}

const UserCouponSchema = new Schema<IUserCoupon>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        coupon: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
        isUsed: { type: Boolean, default: false },
        collectedAt: { type: Date, default: Date.now },
        usedAt: { type: Date },
        orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    },
    { timestamps: true }
);

// Prevent collecting same coupon multiple times (unless we want to allow repeats, usually unique per user per coupon)
UserCouponSchema.index({ user: 1, coupon: 1 }, { unique: true });

const UserCoupon = mongoose.models.UserCoupon || mongoose.model<IUserCoupon>('UserCoupon', UserCouponSchema);

export default UserCoupon;
