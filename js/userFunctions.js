const User = require('../models/user');

async function checkUser(username, password) {
    try {
        // Check if user exists by username
        const user = await User.findOne({ username });

        if (!user) {
            return false; // User does not exist
        }
        const isPasswordCorrect = (password === user.password); 

        return isPasswordCorrect; // Return true if password is correct, false otherwise
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

        // Create a new user instance without hashing the password
        const newUser = new User({
            full_name,
            username,
            password, // Use plain text password here
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

async function getUsers() {
    try {
        const users = await User.find({}); // Fetch all users
        return users;
    } catch (error) {
        console.error("Error finding users:", error);
        throw error; // Optionally rethrow the error for further handling
    }
}

async function getUser(username) {
    try {
        // Select only the fields you want to return
        const user = await User.findOne(
            { username: username },
            'full_name address phone_number email'
        );
        return user;
    } catch (error) {
        console.error("Error finding user:", error);
        throw error; // Optionally rethrow the error for further handling
    }
}

module.exports = { addUser, checkUser, getUsers, getUser }; // Export
