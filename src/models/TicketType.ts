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
            // Allow multiple tickets with same rarity for flexibility
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
