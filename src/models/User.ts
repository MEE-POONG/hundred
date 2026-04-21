import mongoose, { Schema } from 'mongoose';

const UserAddressSchema = new Schema({
  label: String,
  receiverName: String,
  receiverPhone: String,
  address: String,
  subDistrict: String,
  district: String,
  province: String,
  postalCode: String,
  isDefault: { type: Boolean, default: false }
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  image: String,
  phone: String,
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Not-specified'] },
  birthDate: Date,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  provider: { type: String, default: 'credentials' },
  emailVerified: { type: Date, default: null },
  addresses: [UserAddressSchema],
  points: { type: Number, default: 0 },
  membershipTier: { type: String, default: 'Member' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
