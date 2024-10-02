const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the shoe schema
const shoeSchema = new Schema({
    id: Number,
    kind: String,
    brand: String,
    color: String,
    size: [Number],
    inStock: Boolean,
    url: String
});

// Create the shoe model
const Shoe = mongoose.model('Shoe', shoeSchema);
module.exports = Shoe;
