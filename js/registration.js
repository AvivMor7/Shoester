document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get form fields
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const address = document.getElementById('address').value.trim();

    // Validation flags and error message
    let isValid = true;
    let alertMessage = '';

    // Name validation: only English letters and spaces
    const nameRegex = /^[A-Za-z\s]+$/;

    // Check if fullName contains anything other than letters or spaces
    if (!nameRegex.test(fullName)) {
        console.log('Name failed regex check');  // Debug log to see if the regex failed
        alertMessage += 'Full Name must contain only English letters and spaces.\n';
        isValid = false;
    } else {
        console.log('Name passed regex check'); // Debug log if the name is valid
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

    // If validation fails, show the alert and stop the submission
    if (!isValid) {
        alert(alertMessage);
        return; // Stop the form submission
    }

    // If validation passes, proceed with form submission via fetch
    try {
        // Create a FormData object from the form
        const formData = {
            fullName: fullName,
            username: username,
            password: password,
            email: email,
            phoneNumber: phoneNumber,
            address: address
        };

        // Send the data to the server using fetch
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Convert the data to JSON
        });

        // Check if the response is successful
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
