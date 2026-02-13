import mongoose, { Schema } from 'mongoose';

const CartItemSchema = new Schema({
  productId: String,
  productName: String,
  productImage: String,
  price: Number,
  salePrice: Number,
  quantity: Number,
  selectedVariants: { type: Map, of: String },
});

const AddressSchema = new Schema({
  name: String,
  phone: String,
  address: String,
  subDistrict: String,
  district: String,
  province: String,
  postalCode: String,
});

const OrderSchema = new Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  guestId: String,
  items: [CartItemSchema],
  subtotal: Number,
  shipping: Number,
  discount: Number,
  total: Number,
  status: {
    type: String,
    enum: ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending_payment',
  },
  shippingAddress: AddressSchema,
  paymentMethod: String,
  shippingMethod: String,
  trackingNumber: String,
  paidAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
