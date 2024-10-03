// js/server.js
const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const { default: mongoose } = require('mongoose');
const PORT = process.env.PORT || 5555;

const { checkUser } = require('./userFunctions'); // Correct path for userFunctions

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
app.use('/js', express.static(path.join(__dirname))); // Serve from current directory (where server.js is)
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
