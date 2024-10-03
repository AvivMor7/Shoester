let users = []; // Define users globally so it can be accessed later
let usersFetched = false; // Track if users have already been fetched
const userTableBody = document.getElementById('userTableBody');
const showUsersBtn = document.getElementById('showUsersBtn');  // Reference the button
const userList = document.getElementById('userList');  // Reference the user list section

// Fetch users from the server and store them
async function fetchUsers() {
    try {
        const response = await fetch('/fetch-data'); // Adjust the endpoint as needed
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        users = await response.json(); // Get the array of users
        usersFetched = true; // Mark that users have been fetched
        toggleUserList();  // Call toggleUserList() to display the user list after fetching
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('An error occurred while fetching user data. Please check the console for details.');
    }
}

// Function to populate the user list table
function populateUserTable() {
    // Clear existing rows before repopulating
    userTableBody.innerHTML = '';

    // Populate the table with user data
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.full_name}</td>
            <td>${user.email}</td>
            <td>${user.phone_number}</td>
            <td>${user.address}</td>
            <td>
                <button onclick="deleteUser('${user.username}')">Delete User</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Function to delete a user
async function deleteUser(username) {
    // Ask for confirmation before deletion
    if (!confirm('Are you sure you want to delete this user?')) {
        return; // Exit if the user cancels
    }

    try {
        // Send a DELETE request to the server with the username in the URL
        console.log(`Sending DELETE request to: /delete-user/${username}`);
        const response = await fetch(`/delete-user/${username}`, {
            method: 'DELETE', // Use DELETE method
            headers: {
                'Content-Type': 'application/json' // Even though we don't send a body, it's good practice to specify the content type
            }
        });

        // Check if the response is OK (status code 200)
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        // Assuming `users` is an array of user objects, filter out the deleted user
        users = users.filter(user => user.username !== username);  // Use `username` for filtering

        // Re-render the user table after the deletion
        populateUserTable();

        // Show a success message
        alert('User deleted successfully!');
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user. Please check the console for details.');
    }
}


// Function to toggle the visibility of the user list
function toggleUserList() {
    if (userList.style.display === 'none' || userList.style.display === '') {
        // Show the user list
        userList.style.display = 'block';

        // Populate the table with user data (only if we have already fetched users)
        if (usersFetched) {
            populateUserTable();
        } else {
            alert('No users to display. Please fetch users first.');
        }

        // Change button text to "Hide Users"
        showUsersBtn.textContent = 'Hide Users';
    } else {
        // Hide the user list
        userList.style.display = 'none';

        // Change button text to "Show Users"
        showUsersBtn.textContent = 'Show Users';
    }
}

// Initially hide the user list
userList.style.display = 'none';

// Add event listener to the button to toggle the user list on click
showUsersBtn.addEventListener('click', async () => {
    if (!usersFetched) {
        // If users haven't been fetched yet, fetch them and then toggle visibility
        await fetchUsers();
    } else {
        // If users have been fetched, just toggle visibility without fetching again
        toggleUserList();
    }
});
