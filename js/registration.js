document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.success) {
            // Redirect to login page if registration is successful
            alert(result.message); // Show success message
            window.location.href = '/login'; // Redirect to login page
        } else {
            // Show alert for failed registration
            alert(result.message); // Show error message
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please check the console for more details.'); // Handle unexpected errors
    }
});


