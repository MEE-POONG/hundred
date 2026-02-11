import mongoose, { Schema, model, models } from 'mongoose';

const RedemptionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reward: { type: Schema.Types.ObjectId, ref: 'Reward' },
    productName: { type: String, required: true },
    productImage: { type: String, default: '' },
    ticketsUsed: [{
        rarity: { type: String },
        quantity: { type: Number },
    }],
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'shipped', 'completed'],
        default: 'pending',
    },
    shippingAddress: {
        name: { type: String },
        phone: { type: String },
        address: { type: String },
    },
    trackingNumber: { type: String, default: '' },
    rejectedReason: { type: String, default: '' },
    approvedAt: { type: Date },
    shippedAt: { type: Date },
    completedAt: { type: Date },
}, { timestamps: true });

const Redemption = models.Redemption || model('Redemption', RedemptionSchema);

export default Redemption;
