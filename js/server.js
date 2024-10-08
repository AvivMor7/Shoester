const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const { default: mongoose } = require('mongoose');
const session = require('express-session')
const PORT = process.env.PORT || 3030;
const { addShoe, deleteShoe, findShoeById, getShoes} = require('./shoeFunctions'); // Import shoe functions
const {  addUser, checkUser, getUsers, getUser, deleteUser , isAdmin, updateCart} = require('./userFunctions'); // Import user functions
const { getOrdersByUsername, getAllOrders, addOrder,deleteOrder, getAllOrdersGrouped } = require('../js/orderFunctions'); // Import order functions
const Shoe = require('../models/shoe');
const User = require('../models/user');
const Order = require('../models/user');
require('dotenv').config({ path: '.env.local' }); // Load environment variables

// Connect to MongoDB
const mongoURI =  process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.json());  // Enable parsing JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/js', express.static(path.join(__dirname,'../js')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use(express.static(path.join(__dirname, '../html'))); // Serve HTML files

//make session
app.use(session({
    secret: 'avivguygalkorenthebestatthisthingreally',
    resave: false, // avoid resaving session if nothing is changed
    saveUninitialized: false, // don't create session until something is stored
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: false,
        httpOnly: true,
        sameSite: 'lax' 
    }
}));

// Basic route for home page
app.get('/landing_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/landing_page.html'));
});

app.get('/', (req, res) => {
    res.redirect('/landing_page.html');
});

// POST route to handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const isValid = await checkUser(username, password);
        
        if (isValid) {
            // Set session variables
            req.session.username = username;
            req.session.authorized = true;

            // Send a JSON response indicating the redirect
            res.json({ success: true, redirectUrl: '/personal_page.html' });
        } else {
            res.json({ success: false, message: 'Username or password is incorrect.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Route to handle personal cart requests
app.get('/get-cart', async (req, res) => {
    if (req.session.username) {
        try {
            const username = req.session.username;
            const user = await User.findOne({username: username});
            const cart = await user.cart;
            if (cart) {
                return res.json(cart);
            } else {
                return res.status(404).send('Cart not found!');
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            return res.status(500).send('Internal server error');
        }
    } else {
        return res.status(401).send('No user logged in found!');
    }
});


app.post('/add-to-cart', async (req, res) => {
    const { shoeId } = req.body; // shoeId comes from the request body
    const username = req.session.username; // username comes from the session

    if (!username) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Fetch the shoe details using the provided shoeId
        const shoe = await Shoe.findOne({id: shoeId});
        if (!shoe) {
            return res.status(400).json({ error: 'Shoe not found' });
        }

        // Find the user in the database
        const user = await User.findOne({username: username});
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the shoe is already in the user's cart
        let cartItem = user.cart.find(item => item.shoeId === shoeId);

        if (cartItem) {
            // Increment the amount if the shoe is already in the cart
            cartItem.amount += 1;
        } else {
            // Add a new shoe to the cart if it doesn't exist
            user.cart.push({ shoeId: shoeId, amount: 1 }); // Change shoeID to shoeId
        }

        // Save the updated cart in the database
        await updateCart(username, user.cart);

        // Respond with the updated cart
        return res.status(200).json({ message: 'Item added to cart', cart: user.cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Route to handle personal page requests
app.get('/user-data', async (req, res) => {
    if (req.session.username) {
        try {
            const user = await getUser(req.session.username);
            const orders = await getOrdersByUsername(req.session.username);
            if (user) {
                return res.json({ user, orders });
            } else {
                return res.status(404).send('User not found!');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            return res.status(500).send('Internal server error');
        }
    } else {
        return res.status(401).send('No user logged in found!');
    }
});


// POST route for registration
app.post('/register', async (req, res) => {
    const { fullName, username, password, email, phoneNumber, address } = req.body;
    
    // Ensure address is in the correct format
    const formattedAddress = {
        country: 'Israel',
        district: address.district,
        city: address.city,
        street: address.street,
        building_number: address.building_number
    };

    try {
        const isValid = await addUser(fullName, username, password, phoneNumber, email, formattedAddress);
        
        if (isValid) {
            res.send('<script>alert("Sign up successful!"); window.location.href = "../login_page.html";</script>');
        } else {
            res.send('<script>alert("Username already in use"); window.location.href = "../registration.html";</script>');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.send('<script>alert("Internal server error."); window.location.href = "/register";</script>');
    }
});

//delete a user on admin panel
app.delete('/delete-user/:username', async (req, res) => {
    const username = req.params.username;  // Get the username from the URL params
    try {
        const deletedUser = await deleteUser(username);  // Await the deletion result
        if (deletedUser) {
            res.status(200).json({ message: 'User deleted successfully', username: deletedUser });
        } else {
            res.status(404).json({ message: 'User not found' });  // Handle case when user is not found
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
});


app.delete('/delete-order/:order_id', async (req, res) => {
    const order_id = req.params.order_id;  // Get the order from the URL params
    try {
        const deletedOrder = await deleteOrder(order_id);  // Await the deletion result
        if (deletedOrder) {
            res.status(200).json({ message: 'order deleted successfully', order_id: deletedOrder.order_id});
        } else {
            res.status(404).json({ message: 'order not found' });  // Handle case when user is not found
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order' });
    }
});


app.delete('/delete-shoe/:id', async (req, res) => {
    const id = req.params.id;  // Get the shoeid from the URL params
    try {
        const deletedShoe = await deleteShoe(id);  // Await the deletion result
        if (deletedShoe) {
            res.status(200).json({ message: 'Shoe deleted successfully', id: deletedShoe });
        } else {
            res.status(404).json({ message: 'Shoe not found' });  // Handle case when shoe is not found
        }
    } catch (error) {
        console.error('Error deleting shoe:', error);
        res.status(500).json({ message: 'Error deleting shoe' });
    }
});


// get for adminpage user table
app.get("/fetch-users",async(req,res)=>{
    try {
        const data = await getUsers(); // Fetch data from your MongoDB collection
        res.json(data); // Return the data as JSON
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

app.get("/fetch-shoes",async(req,res)=>{
    try {
        const shoes = await getShoes(); // Fetch data from your MongoDB collection
        res.json(shoes); // Return the data as JSON
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

app.get("/fetch-orders",async(req,res)=>{
    try {
        const orders = await getAllOrders(); // Fetch orders from your MongoDB collection
        res.json(orders); // Return the orders as JSON
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

app.get("/fetch-orders-grouped", async (req, res) => {
    try {
        const groupedOrders = await getAllOrdersGrouped(); // Fetch grouped orders
        res.json(groupedOrders); // Return the grouped orders as JSON
    } catch (error) {
        console.error('Error fetching grouped orders:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


// API Endpoint to get products
app.get('/fetch-products/', async (req, res) => {
    try {
        const products = await Shoe.find(); // Fetch all products from DB
        res.json(products);
    }   
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send(error);
    }
});

app.get('/session-check', async (req, res) => {
    if (req.session.username) {
        const user = await getUser(req.session.username);
        const admin = await isAdmin(req.session.username)

        return res.json({ 
            loggedIn: true, 
            user: {
                username: req.session.username,
                is_admin: admin
            }
        });
    } else {
        return res.json({ loggedIn: false });
    }
});

//check if the user is an admin
async function checkAdmin(req, res, next) {
    // Check if the user is logged in
    if (!req.session.username) {
        console.log('User not logged in. Redirecting...');
        return res.redirect('/landing_page.html'); // Redirect if not logged in
    }

    // Check if the user is an admin using your existing isAdmin function
    const isAdminUser = await isAdmin(req.session.username);
    if (!isAdminUser) {
        console.log('User is not an admin. Redirecting...');
        return res.redirect('/landing_page.html'); // Redirect if not an admin
    }

    console.log('User is logged in and is an admin. Continuing...');
    next(); // Proceed to the requested route
}

app.get('/admin_page.html', checkAdmin, (req, res) => {
    // Render the admin page if user is authenticated and is admin
    res.sendFile(path.join(__dirname, 'path_to_your_admin_page/admin_page.html'));
});


// Route to clear cart and save it as an order before clearing
app.post('/checkout', async (req, res) => {
    if (req.session.username) {
        try {
            const username = req.session.username;
            const user = await User.findOne({ username: username });

            if (!user || !user.cart || user.cart.length === 0) {
                return res.status(404).json({ message: 'Cart not found or already empty!' });
            }

            // Function to generate a random 32-bit integer
            function generateRandomOrderId() {
                return Math.floor(Math.random() * Math.pow(2, 31)); // Generate random number between 0 and 2^31 - 1
            }

            let orderId = generateRandomOrderId();
            let existingOrder = await Order.findOne({ order_id: orderId });

            // Check if the generated order ID already exists and regenerate if necessary
            while (existingOrder) {
                orderId = generateRandomOrderId(); // Generate a new order ID
                existingOrder = await Order.findOne({ order_id: orderId }); // Check again if it's unique
            }

            // Extract shoe IDs from the cart, respecting the quantity (amount) of each item
            let price = 0; 
            const shoes_ids = []; 
            
            for (const item of user.cart) {
                for (let i = 0; i < item.amount; i++) {
                    shoes_ids.push(item.shoeId); 
                    let shoe = await Shoe.findOne({ id: item.shoeId });
                    if (shoe) {
                        price += shoe.price; 
                    } else {
                        console.error(`Shoe with ID ${item.shoeId} not found.`);
                    }
                }
            }

            // Create a new order
            const newOrder = {
                order_id: orderId,
                username: username,
                shoes_ids: shoes_ids,
                price: price
            };

            // Save the new order
            await addOrder(newOrder);

            // Clear the user's cart
            user.cart = [];
            await user.save();

            // Send a success message
            res.json({ message: 'Cart cleared and order placed!', order_id: orderId });

        } catch (error) {
            console.error('Error clearing cart and saving order:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    } else {
        return res.status(401).json({ message: 'No user logged in!' });
    }
});



// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.sendStatus(200); // Send success response
    });
});


app.post('/add-shoe', async (req, res) => {
    const { id, kind, brand, color, size, inStock, price, url } = req.body;
    
    try {
        // Call the addShoe function from shoeFunctions
        const newShoe = await addShoe(id, kind, brand, color, size, inStock, price, url);
        
        // Check if the shoe was added successfully
        if (newShoe) {
            res.json({ success: true, message: 'Shoe added successfully!', shoe: newShoe });
        } else {
            res.status(400).json({ success: false, message: 'Failed to add shoe' });
        }
    } catch (err) {
        console.error('Error adding shoe:', err);
        res.status(500).json({ success: false, message: 'Failed to add shoe' });
    }
});


// GET route to retrieve shoes based on cart
app.post('/getShoesFromCart', async (req, res) => {
    const cart = req.body; // Expecting [{ shoeId, amount }]

    if (!Array.isArray(cart) || cart.length === 0) {
        return res.status(400).json({ error: 'Invalid cart format' });
    }

    try {
        const foundShoes = []; // Initialize an array to hold the found shoes

        // Loop through each item in the cart
        for (const item of cart) {
            const shoe = await findShoeById(item.shoeId); // Find the shoe by its ID
            if (shoe) {
                foundShoes.push(shoe); // Push the found shoe to the array
            } else {
                console.log('No shoe found with ID:', item.shoeId); // Log if no shoe is found
            }
        }
        return res.json(foundShoes); // Return the array of found shoes
    } catch (error) {
        console.error('Error fetching shoes:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// POST route to update the user profile
app.post('/update-profile', async (req, res) => {
    const { full_name, address, phone_number, email } = req.body;

    if (!req.session.username) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }

    try {
        const username = req.session.username;
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update the user's profile information
        user.full_name = full_name || user.full_name;
        user.phone_number = phone_number || user.phone_number;
        user.email = email || user.email;

        // Update address object, ensuring each field is checked
        if (address) {
            if (address.district) user.address.district = address.district;
            if (address.city) user.address.city = address.city;
            if (address.street) user.address.street = address.street;
            if (address.building_number) user.address.building_number = address.building_number;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            updatedUser: {
                full_name: user.full_name,
                address: user.address,
                phone_number: user.phone_number,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


// New route to fetch specific shoes by IDs
app.get('/fetch-shoes-by-ids', async (req, res) => {
    const { ids } = req.query;  
    
    if (!ids) {
        return res.status(400).json({ error: 'No shoe IDs provided' });
    }

    const shoeIds = ids.split(',').map(id => id.trim());  // Convert comma-separated string into an array
    
    try {
        // Find shoes by their IDs
        const shoes = await Shoe.find({ id: { $in: shoeIds } });  
        res.json(shoes);  // Send the found shoes as a JSON response
    } catch (error) {
        console.error('Error fetching shoes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
