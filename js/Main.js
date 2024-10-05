document.getElementById('registrationForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get form fields
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const address = document.getElementById('address').value.trim();

    // Validation flags
    let isValid = true;
    let alertMessage = '';

    // Name validation: only English letters
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(fullName)) {
        alertMessage += 'Full Name must contain only English letters.\n';
        isValid = false;
    }

    // Email validation: standard email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alertMessage += 'Please enter a valid email address.\n';
        isValid = false;
    }

    // Phone number validation: only numbers, between 9-15 characters
    const phoneRegex = /^[0-9]{9,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
        alertMessage += 'Phone number must be between 9 and 15 digits long and contain only numbers.\n';
        isValid = false;
    }

    // Password validation: at least 5 characters
    if (password.length < 5) {
        alertMessage += 'Password must be at least 5 characters long.\n';
        isValid = false;
    }

    // Check if all fields are filled
    if (!fullName || !username || !password || !email || !phoneNumber || !address) {
        alertMessage += 'All fields must be filled.\n';
        isValid = false;
    }

    // Show alert message for validation errors
    if (!isValid) {
        alert(alertMessage);
    } else {
        alert('Form submitted successfully!');
        // Here you can proceed with the form submission or further actions
    }
});

// end of registration code

// search bar redirection
function checkEnter(event) {
    if (event.key === 'Enter') {
        handleSearch(); // Call the search function
    }
}

function handleSearch() {
    const query = document.getElementById('searching_box').value;
    // Redirect to the result page with the search query as a parameter
    window.location.href = `../result_page.html?query=${encodeURIComponent(query)}`;
}
// the end of search box functions