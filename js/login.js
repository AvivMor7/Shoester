document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    
        const result = await response.json();
        if (result.success) {
            // Redirect to the personal page using the URL from the response
            window.location.href = result.redirectUrl;
        } else {
            // Show alert for failed login
            alert(result.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please check the console for more details.');
    }
});
