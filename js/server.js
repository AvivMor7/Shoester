const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5555;

// Middleware
app.use(express.static('public')); // Serve static files
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route for home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../landing_page.html')); // Correctly serve your HTML file
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../cart.html')); // Correctly serve your HTML file
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../contacts page.html')); // Correctly serve your HTML file
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin_page.html')); // Correctly serve your HTML file
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../login page.html')); // Correctly serve your HTML file
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../personal_page.html')); // Correctly serve your HTML file
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../registration.html')); // Correctly serve your HTML file
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../result_page.html')); // Correctly serve your HTML file
});


// Example route for handling form submissions
app.post('/submit', (req, res) => {
    console.log(req.body); // Process form data
    res.send('Form submitted!'); // Respond to the client
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
