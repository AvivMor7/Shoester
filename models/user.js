// js/models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
    full_name: String,
    username: String,
    password: String,
    email: String,
    phone_number: String,
    address: String, // Add the address field
    is_admin: Boolean
});

const User = mongoose.model('User', userSchema);
module.exports = User;
