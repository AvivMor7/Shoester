const User = require('../models/user');
const bcrypt = require('bcrypt');

async function checkUser(username, password) {
    try {
        // Check if user exists by username
        const user = await User.findOne({ username });
        
        if (!user) {
            return { success: false, message: 'User not found' }; // User does not exist
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return { success: false, message: 'Incorrect password' }; // Password is incorrect
        }

        return true; // User authenticated
    } catch (error) {
        console.error('Error checking user:', error);
        throw error; // Rethrow the error for further handling
    }
}

const saltRounds = 10; // Define how many salt rounds to use for hashing

// Function to add a new user
async function addUser(full_name, username, password, phone_number, email, address) {
    try {
        // Check if the username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            console.log("Username or email already taken.");
            return;
        }

        // Hash the password before saving the user
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user instance with the hashed password
        const newUser = new User({
            full_name,
            username,
            password: hashedPassword, // Use the hashed password here
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
        const users = await User.find({}); // Add await here
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
