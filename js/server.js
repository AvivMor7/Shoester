// js/server.js
const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const { default: mongoose } = require('mongoose');
const PORT = process.env.PORT || 5555;

const { addShoe, deleteShoe, findShoe, findShoeById} = require('./shoeFunctions'); // Import shoe functions
const {  addUser, checkUser, getUsers, getUser } = require('./userFunctions'); // Import user functions
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
app.use('/js', express.static(path.join(__dirname, 'js')));
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

// POST route for registration
app.post('/register', async (req, res) => {
    const { fullName, username, password, email, phoneNumber, address } = req.body;
    
    // Log incoming registration data for debugging || removing these after done checking
    console.log("Registration request received:", {
        fullName,
        username,
        password,
        email,
        phoneNumber,
        address
   });
    
    try {
        const isValid = await addUser(fullName, username, password, phoneNumber, email, address);
        
        if (isValid) {
            // Send a success response if user is added successfully
            res.redirect('/workspaces/Shoester/html/login_page.html');
        } else {
            // Send an error response if username or email is taken
            res.json({ success: false, message: 'Username already taken.' });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});
app.get("/fetch-data",async(req,res)=>{
    try {
        const data = await getUsers(); // Fetch data from your MongoDB collection
        console.log(data)
        res.json(data); // Return the data as JSON
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
})



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
