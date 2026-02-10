import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    code: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ['available', 'used', 'expired'],
      default: 'available',
    },
    source: {
      type: String, // e.g., 'purchase', 'promotion', 'admin'
      default: 'purchase',
    },
    usedAt: {
      type: Date,
    },
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reward',
    },
  },
  {
    timestamps: true,
  }
);

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

export default Ticket;
