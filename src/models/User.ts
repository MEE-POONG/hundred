import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  image: String,
  phone: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  provider: { type: String, default: 'credentials' },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
