const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the order schema
const orderSchema = new Schema({
    order_id: { type: Number, required: true, unique: true }, // Unique order ID
    username: { type: String, required: true }, // Username of the person who ordered
    shoes_ids: { type: [Number], required: true }, // Array of shoe IDs
});

// Create the order model
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
