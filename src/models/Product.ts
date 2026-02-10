import mongoose, { Schema } from 'mongoose';

const ProductVariantSchema = new Schema({
  id: String,
  name: String,
  type: {
    type: String,
    enum: ['flavor', 'size'],
  },
  options: [String],
  priceModifier: Number,
});

const RedeemRuleSchema = new Schema({
  productId: String,
  requiredTickets: [{
    ticketId: String,
    rarity: {
      type: String,
      enum: ['Common', 'Rare', 'Epic', 'Legendary'],
    },
    quantity: Number,
  }],
});

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  shortDescription: String,
  price: { type: Number, required: true },
  salePrice: Number,
  images: [String],
  category: String,
  categoryName: String,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isOnSale: { type: Boolean, default: false },
  ingredients: [String],
  directions: String,
  warnings: [String],
  fda: String,
  variants: [ProductVariantSchema],
  redeemable: RedeemRuleSchema,
}, {
  timestamps: true,
});

// Virtual for isInStock
ProductSchema.virtual('isInStock').get(function () {
  return this.stock > 0;
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
