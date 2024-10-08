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

// Function to get all orders (for admin dashboard), grouped by username and sorted by totalSpent descending
async function getAllOrdersGrouped() {
    try {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: "$username", // Group by the username field
                    totalOrders: { $sum: 1 }, // Count the total orders for each user
                    totalSpent: { $sum: "$price" } // Calculate total spent by each user
                }
            },
            {
                $project: {
                    username: "$_id", // Include the username in the output
                    totalOrders: 1, // Include totalOrders
                    totalSpent: 1, // Include totalSpent
                    _id: 0 // Exclude the default _id field from the output
                }
            }
        ]);
        return orders;
    } catch (error) {
        console.error("Error retrieving all orders:", error);
        throw error; // Handle error in the calling function
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
    getAllOrdersGrouped,
    getAllOrders,
    addOrder,
    deleteOrder
};
