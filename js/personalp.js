const { getUser } = require('./userFunctions'); // Import user functions

window.onload = function() {
    // Assume username is defined or obtained in some way
    const username = 'johndoe';  // You can get this value from somewhere, like user login

    // Fetch the user data based on the username
    const user = getUser(guyw);

    // Check if the user data was retrieved correctly
    if (user) {
        // Populate the profile information dynamically
        document.getElementById("profile").innerHTML = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Address:</strong> ${user.address}</p>
            <p><strong>Phone Number:</strong> ${user.phoneNumber}</p>
            <p><strong>Email:</strong> ${user.email}</p>
        `;
    } else {
        document.getElementById("profile").innerHTML = "<p>User not found</p>";
    }
};
