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
            // Redirect to personal page if login is successful
            window.location.href = '/html/personal_page.html';
        } else {
            // Show a browser alert for failed login
            alert(result.message); // Display error message in a popup alert
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please check the console for more details.');
    }
});
