// js/server.js
const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const { default: mongoose } = require('mongoose');
const PORT = process.env.PORT || 8080;

const { addShoe, deleteShoe, findShoe, findShoeById} = require('./shoeFunctions'); // Import shoe functions
const {  addUser, checkUser, getUsers, getUser, deleteUser } = require('./userFunctions'); // Import user functions
const { getOrdersByUsername, getAllOrders, addOrder } = require('../js/orderFunctions'); // Import order functions
require('dotenv').config({ path: '.env.local' }); // Load environment variables

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
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

// Basic route for home page
app.get('/landing_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/landing_page.html'));
});

app.get('/', (req, res) => {
    res.redirect('/landing_page.html');
});

// Add a POST route to handle login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const isValid = await checkUser(username, password);
        
        if (isValid) {
            // Send a success response if credentials are valid
            res.json({ success: true, message: 'Login successful!' }); // Send success message
        } else {
            // Send an error response if credentials are invalid
            res.json({ success: false, message: 'Username or password is incorrect.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});


// Assuming you have set up a session and flash messaging middleware
const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
    secret: 'your-secret', // Replace with your secret
    resave: false,
    saveUninitialized: true,
}));

app.use(flash());

// POST route for registration
app.post('/register', async (req, res) => {
    const { fullName, username, password, email, phoneNumber, address } = req.body;
    try {
        const isValid = await addUser(fullName, username, password, phoneNumber, email, address);
        
        if (isValid) {
            req.flash('success_msg', 'Registration successful! Redirecting...');
            return res.redirect('../login_page.html'); // Redirect to the login page
        } else {
            req.flash('error_msg', 'Username or email already taken. Please try again.');
            return res.redirect('../registration.html'); // Redirect back to the registration page
        }
    } catch (error) {
        console.error('Error during registration:', error);
        req.flash('error_msg', 'Internal server error. Please try again later.');
        return res.redirect('/register'); // Redirect back to the registration page
    }
});





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

// get for adminpage user table
app.get("/fetch-data",async(req,res)=>{
    try {
        const data = await getUsers(); // Fetch data from your MongoDB collection
        res.json(data); // Return the data as JSON
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
