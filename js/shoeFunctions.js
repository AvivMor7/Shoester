const Shoe = require('../models/shoe'); // Adjust the path if necessary

// Function to add a shoe
async function addShoe(id, kind, brand, color, size, inStock, url) {
    const newShoe = new Shoe({
        id,
        kind,
        brand,
        color,
        size,
        inStock,
        url
    });

    try {
        const result = await newShoe.save();
        console.log('Shoe added successfully:', result);
        return result; // Return the result if needed
    } catch (error) {
        console.error('Error adding shoe:', error);
        throw error; // Rethrow the error for further handling
    }
}

// Function to delete a shoe by ID
async function deleteShoe(id) {
    try {
        const result = await Shoe.deleteOne({ id }); // Assuming 'id' is a unique identifier
        if (result.deletedCount === 0) {
            console.log('No shoe found with that ID.');
            return null; // Return null if no shoe was found
        }
        console.log('Shoe deleted successfully:', id);
        return id; // Return the deleted ID or a success message
    } catch (error) {
        console.error('Error deleting shoe:', error);
        throw error; // Rethrow the error for further handling
    }
}

module.exports = { addShoe, deleteShoe }; // Export both functions