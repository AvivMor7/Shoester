const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
    full_name: String,
    username: String,
    password: String,
    email: String,
    phone_number: String,
    address: {
        country: { type: String, default: 'Israel' }, // Set default country
        district: { type: String, enum: ['North', 'Center', 'South'], required: true },
        city: { type: String, required: true },
        street: { type: String, required: true },
        building_number: { type: String, required: true }
    },
    is_admin: { type: Boolean, default: false },
    cart: [{
        shoeId: Number,
        amount: Number
    }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
