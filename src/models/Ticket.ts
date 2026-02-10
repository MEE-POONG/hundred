import mongoose, { Schema } from 'mongoose';

// Ticket Type Configuration (Admin can modify probabilities)
const TicketTypeSchema = new Schema({
  ticketId: { type: String, required: true, unique: true },
  rarity: {
    type: String,
    enum: ['Common', 'Rare', 'Epic', 'Legendary'],
    required: true,
  },
  name: String,
  color: String,
  glowColor: String,
  probability: { type: Number, required: true },
  icon: String,
});

// Per-user Ticket Inventory
const TicketInventorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  tickets: [{
    ticketId: String,
    rarity: String,
    quantity: { type: Number, default: 0 },
  }],
}, {
  timestamps: true,
});

// Draw History
const DrawHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ticketRarity: String,
  ticketName: String,
  drawnAt: { type: Date, default: Date.now },
});

// Redemption History
const RedemptionHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: String,
  productName: String,
  productImage: String,
  ticketsUsed: [{
    rarity: String,
    quantity: Number,
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'shipped'],
    default: 'pending',
  },
  redeemedAt: { type: Date, default: Date.now },
});

export const TicketType = mongoose.models.TicketType || mongoose.model('TicketType', TicketTypeSchema);
export const TicketInventory = mongoose.models.TicketInventory || mongoose.model('TicketInventory', TicketInventorySchema);
export const DrawHistory = mongoose.models.DrawHistory || mongoose.model('DrawHistory', DrawHistorySchema);
export const RedemptionHistory = mongoose.models.RedemptionHistory || mongoose.model('RedemptionHistory', RedemptionHistorySchema);
