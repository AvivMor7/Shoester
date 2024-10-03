const mongoose = require('mongoose');
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
async function findShoe(searchTerm) {
 
    try {
        // Create a query object with $regex for partial matches across all fields
        const query = {};

        // Use $regex with 'i' for case-insensitive search across all fields
        query['$or'] = [
            { kind: { $regex: new RegExp(searchTerm, 'i') } },
            { brand: { $regex: new RegExp(searchTerm, 'i') } },
            { color: { $regex: new RegExp(searchTerm, 'i') } }
        ];

        console.log('MongoDB query:', query); // For debugging: see what the query looks like

        // Perform the search using the constructed query object
        const shoes = await Shoe.find(query);

        if (shoes.length === 0) {
            console.log('No shoes found matching the search term:', searchTerm);
            return []; // Return an empty array if no results are found
        }

        console.log('Shoes found:', shoes); // Log the results
        return shoes; // Return the found shoes
    } catch (error) {
        console.error('Error finding shoes:', error.message);
        throw new Error('Failed to find shoes'); // Throw a custom error for further handling
    }
}

async function findShoeById(id) {
    try {
        // Check if the ID is valid. If valid, cast it to ObjectId using `new`
        const objectId = mongoose.Types.ObjectId.isValid(id) ? new mongoose.Types.ObjectId(id) : id;

        // Search for the shoe by its unique _id
        const shoe = await Shoe.findById(objectId); // Use _id if it's ObjectId

        // Check if a shoe is found
        if (!shoe) {
            console.log('No shoe found with that ID:', id);
            return null; // Return null if no shoe is found
        }

        // Log the shoe details for debugging
        console.log('Shoe found:', shoe);
        return shoe; // Return the found shoe
    } catch (error) {
        console.error('Error finding shoe by ID:', error.message);
        throw new Error('Failed to find shoe by ID'); // Throw a custom error for further handling
    }
}


module.exports = { addShoe, deleteShoe, findShoe, findShoeById }; // Export both functions