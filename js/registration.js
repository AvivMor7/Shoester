const { checkUser, addUser } = require('./userFunctions');

document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve the parameters entered by the user
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const full_name = document.getElementById('fullName').value; // Make sure the ID is correct
    const email = document.getElementById('email').value;
    const phone_number = document.getElementById('phoneNumber').value;
    const address = document.getElementById('address').value;

    try {
        const response = await checkUser(username);

        if (response.success === false) {
            // Show an error message to the user
            alert(response.message);
        } else {
            // Proceed with sign-up logic
            const addResponse = await addUser(username, password, full_name, email, phone_number, address);
            if (addResponse.success) {
                alert("User added to the database successfully!");
                // Optionally redirect or reset the form
                document.getElementById('signupForm').reset(); // Reset the form
            } else {
                alert(addResponse.message || "Failed to add user.");
            }
        }
    } catch (error) {
        console.error('Error during sign-up:', error);
        alert('An error occurred. Please try again.');
    }
});
