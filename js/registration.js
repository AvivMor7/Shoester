document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const email = document.getElementById('email').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    
    // New address fields
    const district = document.getElementById('district').value.trim();
    const city = document.getElementById('city').value.trim();
    const street = document.getElementById('street').value.trim();
    const buildingNumber = document.getElementById('buildingNumber').value.trim();

    let isValid = true;

    clearErrorMessages();

    const nameRegex = /^[A-Za-z\s]+$/;

    if (!nameRegex.test(fullName)) {
        showError('fullNameError', 'Full Name must contain only English letters and spaces.');
        isValid = false;
    }

    if (username.includes(' ')) {
        showError('usernameError', 'Username cannot contain spaces.');
        isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address.');
        isValid = false;
    }

    const phoneRegex = /^[0-9]{9,15}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
        showError('phoneError', 'Phone number must be between 9 and 15 digits long and contain only numbers.');
        isValid = false;
    }

    if (password.length < 5) {
        showError('passwordError', 'Password must be at least 5 characters long.');
        isValid = false;
    }

    // Address validation
    if (!district || !city || !street || !buildingNumber) {
        showError('addressError', 'All address fields must be filled.');
        isValid = false;
    }

    if (!isValid) {
        return; 
    }

    try {
        const formData = {
            fullName,
            username,
            password,
            email,
            phoneNumber,
            address: { // Create an address object
                district,
                city,
                street,
                building_number: buildingNumber
            }
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
            window.location.href = '/login_page.html';  
        } else {
            throw new Error('Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please check the console for more details.');
    }
});

// Function to clear error messages
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach((message) => {
        message.textContent = '';
    });
}

// Function to display error messages
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}
