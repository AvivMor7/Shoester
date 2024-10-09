document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get form fields
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const address = document.getElementById('address').value.trim();

    // Validation flags and error messages
    let isValid = true;

    // Clear previous error messages
    clearErrorMessages();

    // Name validation: only English letters and spaces
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(fullName)) {
        showError('fullNameError', 'Full Name must contain only English letters and spaces.');
        isValid = false;
    }

    // Username validation: no spaces
    if (username.includes(' ')) {
        showError('usernameError', 'Username cannot contain spaces.');
        isValid = false;
    }

    // Email validation: standard email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address.');
        isValid = false;
    }

    // Phone number validation: only numbers, between 9-15 characters
    const phoneRegex = /^[0-9]{9,15}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
        showError('phoneError', 'Phone number must be between 9 and 15 digits long and contain only numbers.');
        isValid = false;
    }

    // Password validation: at least 5 characters
    if (password.length < 5) {
        showError('passwordError', 'Password must be at least 5 characters long.');
        isValid = false;
    }

    // Check if all fields are filled
    if (!fullName || !username || !password || !email || !address) {
        showError('fullNameError', 'All fields must be filled, except Phone Number and Address.');
        isValid = false;
    }

    // If validation fails, stop the submission
    if (!isValid) {
        return; // Stop the form submission
    }

    // If validation passes, proceed with form submission via fetch
    try {
        const formData = {
            fullName,
            username,
            password,
            email,
            phoneNumber,
            address,
        };

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert('Form submitted successfully!');
            window.location.href = '/login_page.html';  // Redirect to a welcome page or login
        } else {
            throw new Error('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please check the console for more details.');
    }
});

// Function to show error messages
function showError(elementId, message) {
    document.getElementById(elementId).textContent = message;
}

// Function to clear previous error messages
function clearErrorMessages() {
    document.getElementById('fullNameError').textContent = '';
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('phoneError').textContent = '';
    document.getElementById('addressError').textContent = '';
}

// Real-time validation for each field
document.querySelectorAll('#registrationForm input').forEach(input => {
    input.addEventListener('input', () => {
        clearErrorMessages(); // Clear errors on input
    });
});
