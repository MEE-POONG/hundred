import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        itemType: {
            type: String, // 'ticket_card' or 'product'
            required: true,
        },
        itemId: {
            type: String, // e.g. 'common_ticket', 'rare_ticket' or product _id
            required: true,
        },
        rarity: {
            type: String, // for tickets
        },
        quantity: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure unique item per user
inventorySchema.index({ user: 1, itemId: 1 }, { unique: true });

const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);

export default Inventory;
