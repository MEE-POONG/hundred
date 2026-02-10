import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a reward name'],
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        type: {
            type: String,
            enum: ['physical', 'digital', 'point', 'coupon'],
            default: 'physical',
        },
        rarity: {
            type: String,
            enum: ['common', 'rare', 'epic', 'legendary'],
            default: 'common',
        },
        probability: {
            type: Number, // Percentage chance (e.g., 0.1 for 10%)
            required: true,
        },
        stock: {
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

const Reward = mongoose.models.Reward || mongoose.model('Reward', rewardSchema);

export default Reward;
