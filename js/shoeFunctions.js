const mongoose = require('mongoose');
const Shoe = require('../models/shoe'); 

// Function to add a shoe
async function addShoe(id, kind, brand, color, size, inStock,price, url) {
    const newShoe = new Shoe({
        id,
        kind,
        brand,
        color,
        size,
        inStock,
        price,
        url
    });

    try {
        const result = await newShoe.save();
        console.log('Shoe added successfully:', result);
        return result; // Return the result 
    } catch (error) {
        console.error('Error adding shoe:', error);
        throw error; // Rethrow the error 
    }
}

// Function to delete a shoe by ID
async function deleteShoe(id) {
    try {
        const result = await Shoe.deleteOne({ id }); 
        if (result.deletedCount === 0) {
            console.log('No shoe found with that ID.');
            return null; 
        }
        console.log('Shoe deleted successfully:', id);
        return id; // Return the deleted ID 
    } catch (error) {
        console.error('Error deleting shoe:', error);
        throw error; // Rethrow the error 
    }
}

async function getShoes() {
    try {
        const shoes = await Shoe.find({}); // Fetch all shoes
        return shoes;
    } catch (error) {
        console.error("Error finding shoes:", error);
        throw error; 
    }
}

async function findShoeById(id) {
    try {
        // Search for the shoe by its unique id
        const shoe = await Shoe.findOne({ id: id }); // matching by id field

        // Check if a shoe is found
        if (!shoe) {
            console.log('No shoe found with that ID:', id);
            return null; 
        }
        return shoe; 
    } catch (error) {
        console.error('Error finding shoe by ID:', error.message);
        throw new Error('Failed to find shoe by ID'); 
    }
}



module.exports = { addShoe, deleteShoe, findShoeById, getShoes }; // Export the functions outside