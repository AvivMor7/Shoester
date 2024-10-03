const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const { default: mongoose } = require('mongoose');
const PORT = process.env.PORT || 5555;

const { addShoe, deleteShoe, findShoe, findShoeById} = require('./shoeFunctions'); // Import shoe functions
const {  addUser, checkUser, getUsers, getUser } = require('./userFunctions'); // Import user functions
const { getOrdersByUsername, getAllOrders, addOrder } = require('../js/orderFunctions'); // Import order functions
require('dotenv').config({ path: '/workspaces/Shoester/.env.local' }); // Load environment variables

// Connect to MongoDB
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB successfully"))
    .catch(err => console.log("Error connecting to MongoDB"));

// Serve the html, css and assets folders
app.use('/css', express.static(path.join(__dirname, '../css')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use(express.static(path.join(__dirname, '../html')));
app.use(bodyParser.urlencoded({ extended: true }));

// Basic route for home page
app.get('/landing_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../html/landing_page.html')); // Serve your homepage
});

app.get('/', (req, res) => {
    res.redirect('/landing_page.html'); // Redirect root to homepage
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});