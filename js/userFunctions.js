const User = require('../models/user');

async function checkUser(username, password) {
    try {
        // Check if user exists by username
        const user = await User.findOne({ username });

        if (!user) {
            return false; // User does not exist
        }
        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password); 

        return isPasswordCorrect; // Return true if password is correct, false otherwise
    } catch (error) {
        console.error('Error checking user:', error);
        throw error; // Rethrow the error for further handling
    }
}


async function updateCart(username, updatedCart) {
    try {
        // Find the user by username and update their cart
        const result = await User.findOneAndUpdate(
            { username: username },
            { cart: updatedCart }, // Set the new cart data with shoeId and amount
            { new: true, useFindAndModify: false } // Return the updated document and avoid deprecated options
        );

        // If user is not found, throw an error
        if (!result) {
            throw new Error('User with username ${username} not found.');
        }

        return result; // Return the updated user document
    } catch (error) {
        console.error('Error updating cart:', error);
        throw error; // Re-throw the error so that it can be handled in the calling function
    }
}

async function isAdmin(username) {
    try {
        // Check if user exists by username
        const user = await User.findOne({ username });

        if (user.is_admin) {
            return true;
        }
        return false; // Return true if password is correct, false otherwise
    } catch (error) {
        console.error('Error checking user:', error);
        throw error; // Rethrow the error for further handling
    }
}

async function deleteUser(username) {
    try {
        const result = await User.deleteOne({ username }); // Assuming 'id' is a unique identifier
        if (result.deletedCount === 0) {
            console.log('No user found with that username.');
            return null; // Return null if no shoe was found
        }
        console.log('user deleted successfully:', username);
        return username; // Return the deleted ID or a success message
    } catch (error) {
        console.error('Error deleting username:', error);
        throw error; // Rethrow the error for further handling
    }
}

// Function to add a new user
async function addUser(full_name, username, password, phone_number, email, address) {
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            console.log("Username or email already taken.");
            return false;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            full_name,
            username,
            password: hashedPassword,
            phone_number,
            email,
            address, // Save the address object
            is_admin: false,
            cart: []
        });

        await newUser.save();
        return true;
    } catch (error) {
        console.error("Error adding user:", error);
        return false;
    }
}

async function getUsers() {
    try {
        const users = await User.find({ is_admin: false }); // Fetch all users
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

module.exports = { addUser, checkUser, getUsers, getUser, deleteUser , isAdmin, updateCart}; // Export
