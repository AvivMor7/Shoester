// js/userFunctions.js
const User = require('../models/user');

// Function to check if a user exists by email or username
async function checkUser(email, username) {
    try {
        const userByEmail = await User.findOne({ email });
        const userByUsername = await User.findOne({ username });

        if (userByEmail) {
            return { exists: true, field: 'email', value: email }; // User exists by email
        }

        if (userByUsername) {
            return { exists: true, field: 'username', value: username }; // User exists by username
        }

        return { exists: false }; // User does not exist
    } catch (error) {
        console.error('Error checking user:', error);
        throw error; // Rethrow the error for further handling
    }
}

// Function to add a new user
async function addUser(full_name, username, password, phone_number, email, address) {
    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            console.log("Username or email already taken.");
            return;
        }

        // Create a new user instance
        const newUser = new User({
            full_name,
            username,
            password,
            phone_number,
            email,
            address, // Include address in the user object
            is_admin: false // Set is_admin to false for new users
        });

        // Save the user to the database
        await newUser.save();
        console.log("User added successfully:", newUser);
    } catch (error) {
        console.error("Error adding user:", error);
    }
}


module.exports = { addUser, checkUser }; // Export both functions
