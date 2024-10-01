const express = require('express'); 
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5555;

// Middleware
app.use(express.static('css')); // Serve static files i need to find the css file and put it here
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Basic route for home page

app.get('/landing_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../landing_page.html')); // Correctly serve your HTML file
});

app.get('/cart.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../cart.html')); // Correctly serve your HTML file

});
app.get('/admin_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin_page.html')); // Correctly serve your HTML file
});
app.get('/login_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../login_page.html')); // Correctly serve your HTML file
});
app.get('/personal_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../personal_page.html')); // Correctly serve your HTML file
});
app.get('/registration.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../registration.html')); // Correctly serve your HTML file
});
app.get('/result_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../result_page.html')); // Correctly serve your HTML file
});
app.get('/contacts_page.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../contacts_page.html')); // Correctly serve your HTML file
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../landing_page.html')); // Correctly serve your HTML file
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
