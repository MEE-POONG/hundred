import mongoose, { Schema, model, models } from 'mongoose';

const StockMovementSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    type: { type: String, enum: ['in', 'out'], required: true },
    quantity: { type: Number, required: true },
    reason: { type: String, required: true },
    note: { type: String, default: '' },
    performedBy: { type: String, default: 'admin' },
}, { timestamps: true });

const StockMovement = models.StockMovement || model('StockMovement', StockMovementSchema);

export default StockMovement;
