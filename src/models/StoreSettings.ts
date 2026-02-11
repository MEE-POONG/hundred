import mongoose, { Schema, model, models } from 'mongoose';

const StoreSettingsSchema = new Schema({
    name: { type: String, default: 'SupplementShop' },
    description: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    businessHours: { type: String, default: '09:00 - 22:00' },
    logo: { type: String, default: '' }, // URL of the logo image
    socials: {
        facebook: { type: String, default: '' },
        line: { type: String, default: '' },
        instagram: { type: String, default: '' },
    },
    paymentMethods: [{
        name: { type: String },
        icon: { type: String },
        enabled: { type: Boolean, default: true }
    }],
    shippingMethods: [{
        name: { type: String },
        icon: { type: String },
        enabled: { type: Boolean, default: true }
    }],
}, { timestamps: true });

// Prevent recompilation of model
const StoreSettings = models.StoreSettings || model('StoreSettings', StoreSettingsSchema);

export default StoreSettings;
