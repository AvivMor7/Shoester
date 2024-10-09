const Order = require('../models/order');

// Function to get all orders for a specific username
async function getOrdersByUsername(username) {
    try {
        const orders = await Order.find({ username });
        return orders;
    } catch (error) {
        console.error("Error retrieving orders for user:", error);
        throw error; // the error for handling in the calling function
    }

}

// Function to get all orders (for admin)
async function getAllOrders() {
    try {
        const orders = await Order.find({});
        return orders;
    } catch (error) {
        console.error("Error retrieving all orders:", error);
        throw error; // the error for handling in the calling function
    }

}

// Function to add a new order
async function addOrder(orderData) {
    const { order_id, username, shoes_ids, price } = orderData; // Extract price from orderData
    try {
        const newOrder = new Order({
            order_id,
            username,
            shoes_ids,
            price
        });
        await newOrder.save();
        return newOrder;
    } catch (error) {
        console.error("Error adding order:", error);
        throw error; //the error for handling in the calling function
    }
}



async function deleteOrder(order_id) {
    try {
        const result = await Order.deleteOne({order_id: order_id});
        if (result.deletedCount === 0) {
            console.log('No order found with that id.');
            return null; // Return null if no order was found
        }
        console.log('order deleted successfully:', order_id);
        return order_id; // Return the deleted ID or a success message
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error; // the error for further handling
    }
}

module.exports = {
    getOrdersByUsername,
    getAllOrders,
    addOrder,
    deleteOrder
};
