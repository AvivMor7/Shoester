document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    try {
        await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        // The server will handle alerts and redirects
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please check the console for more details.'); // Handle unexpected errors
    }
});