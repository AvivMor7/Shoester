const express = require('express'); // Correct import
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5555;

// Middleware
app.use(express.static('public')); // Serve static files
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route for home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Serve your HTML file
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
