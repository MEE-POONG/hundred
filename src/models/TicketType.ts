import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        rarity: {
            type: String,
            enum: ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'],
            required: true,
            unique: true, // Typically one definition per rarity, or allow multiple?
            // Actually, we might have multiple 'Common' tickets with different designs?
            // But based on current simple system, 1 rarity = 1 type.
            // Let's NOT make it unique for flexibility.
        },
        probability: {
            type: Number,
            required: true,
            min: 0,
            max: 1,
        },
        icon: {
            type: String,
            required: true, // Emoji or URL
        },
        color: {
            type: String,
            required: true, // Hex code e.g. #FF0000
        },
        glowColor: {
            type: String,
            required: true, // CSS string e.g. rgba(255, 0, 0, 0.5)
        },
        description: {
            type: String,
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

const TicketType = mongoose.models.TicketType || mongoose.model('TicketType', ticketTypeSchema);

export default TicketType;
