document.getElementById('showUsersBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('/fetch-data'); // Adjust the endpoint as needed
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const users = await response.json(); // Get the array of users

        const dataContainer = document.getElementById('dataContainer');
        dataContainer.innerHTML = ''; // Clear previous data
        
        // Populate the table with user data
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phoneNumber}</td>
                <td>${user.address}</td>
            `;
            userTableBody.appendChild(row);
        });
        
    }
     catch (error) {
        console.error('Error fetching users:', error);
        alert('An error occurred while fetching user data. Please check the console for details.');
    }
    function toggleUserList() {
        if (userList.style.display === 'none' || userList.style.display === '') {
            // Show the user list
            userList.style.display = 'block';

            // Populate the table with user data every time the user list is shown
            populateUserTable();

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
    showUsersBtn.addEventListener('click', toggleUserList);
});
