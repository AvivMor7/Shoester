const Order = require('../models/order');

// Function to get all orders for a specific username
async function getOrdersByUsername(username) {
    try {
        const orders = await Order.find({ username });
        return orders;
    } catch (error) {
        console.error("Error retrieving orders for user:", error);
        throw error; // Rethrow the error for handling in the calling function
    }

}

// Function to get all orders (for admin)
async function getAllOrders() {
    try {
        const orders = await Order.find({});
        return orders;
    } catch (error) {
        console.error("Error retrieving all orders:", error);
        throw error; // Rethrow the error for handling in the calling function
    }

}

// Function to add a new order
async function addOrder(orderData) {
    const { order_id, username, shoes_ids } = orderData;
    try {
        const newOrder = new Order({
            order_id,
            username,
            shoes_ids,
        });
        await newOrder.save();
        return newOrder;
    } catch (error) {
        console.error("Error adding order:", error);
        throw error; // Rethrow the error for handling in the calling function
    }
}

module.exports = {
    getOrdersByUsername,
    getAllOrders,
    addOrder
};
