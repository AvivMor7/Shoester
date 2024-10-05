let users = []; // Define users globally so it can be accessed later
let usersFetched = false; // Track if users have already been fetched

let shoes = []; // Define shoes globally so it can be accessed later
let shoesFetched = false; // Track if shoes have already been fetched

let orders = []; // Define orders globally so it can be accessed later
let ordersFetched = false; // Track if past orders have already been fetched

// DOM elements for users
const userTableBody = document.getElementById('userTableBody');
const showUsersBtn = document.getElementById('showUsersBtn');  
const userList = document.getElementById('userList');  

// DOM elements for shoes
const shoeTableBody = document.getElementById('shoeTableBody');
const showShoesBtn = document.getElementById('showShoesBtn');  
const shoeList = document.getElementById('shoeList');  

// DOM elements for past orders
const orderTableBody = document.getElementById('orderTableBody');
const showOrdersBtn = document.getElementById('showOrdersBtn');
const orderList = document.getElementById('orderList');

// Reusable function to toggle visibility of a section
function toggleListSection(listElement, button, fetched, populateFunction) {
    if (listElement.style.display === 'none' || listElement.style.display === '') {
        // Show the section
        listElement.style.display = 'block';
        
        // If data has been fetched, populate the table
        if (fetched) {
            populateFunction();
        } else {
            alert('No data available. Please fetch data first.');
        }

        // Change button text to "Hide"
        button.textContent = 'Hide';
    } else {
        // Hide the section
        listElement.style.display = 'none';

        // Change button text to "Show"
        button.textContent = 'Show';
    }
}

// Fetch users from the server and store them
async function fetchUsers() {
    try {
        const response = await fetch('/fetch-data');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        users = await response.json(); // Get the array of users
        usersFetched = true; // Mark that users have been fetched
        toggleListSection(userList, showUsersBtn, usersFetched, populateUserTable);
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
    if (users.length === 0) {
        userTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No users available</td></tr>';
    } else {
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.full_name}</td>
                <td>${user.email}</td>
                <td>${user.phone_number}</td>
                <td>${user.address}</td>
                <td><button class="btn btn-danger" onclick="deleteUser('${user.username}')">Delete User</button></td>
            `;
            userTableBody.appendChild(row);
        });
    }
}

// Fetch shoes from the server and store them
async function fetchShoes() {
    try {
        const response = await fetch('/fetch-shoes');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        shoes = await response.json(); // Get the array of shoes
        shoesFetched = true; // Mark that shoes have been fetched
        toggleListSection(shoeList, showShoesBtn, shoesFetched, populateShoeTable);
    } catch (error) {
        console.error('Error fetching shoes:', error);
        alert('An error occurred while fetching shoe data. Please check the console for details.');
    }
}

// Function to populate the shoe list table
function populateShoeTable() {
    // Clear existing rows before repopulating
    shoeTableBody.innerHTML = '';

    // Populate the table with shoe data
    if (shoes.length === 0) {
        shoeTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No shoes available</td></tr>';
    } else {
        shoes.forEach(shoe => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${shoe.id}</td>
                <td>${shoe.kind}</td>
                <td>${shoe.brand}</td>
                <td>${shoe.color}</td>
                <td>${shoe.size}</td>
                <td><button class="btn btn-danger" onclick="deleteShoe('${shoe.id}')">Delete</button></td>
            `;
            shoeTableBody.appendChild(row);
        });
    }
}

// Fetch past orders from the server and store them
async function fetchOrders() {
    try {
        const response = await fetch('/fetch-orders');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        orders = await response.json(); // Get the array of orders
        ordersFetched = true; // Mark that orders have been fetched
        toggleListSection(orderList, showOrdersBtn, ordersFetched, populateOrderTable);
    } catch (error) {
        console.error('Error fetching orders:', error);
        alert('An error occurred while fetching order data. Please check the console for details.');
    }
}

// Function to populate the past orders table
function populateOrderTable() {
    // Clear existing rows before repopulating
    orderTableBody.innerHTML = '';

    // Populate the table with order data
    if (orders.length === 0) {
        orderTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No past orders available</td></tr>';
    } else {
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.username}</td>
                <td>${order.order_id}</td>
                <td>${order.shoes_ids}</td>
                <td><button class="btn btn-danger" onclick="deleteOrder('${order.orderId}')">Delete Order</button></td>
            `;
            orderTableBody.appendChild(row);
        });
    }
}

// Function to delete a user
async function deleteUser(username) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return; // Exit if the user cancels
    }

    try {
        const response = await fetch(`/delete-user/${username}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        // Filter out the deleted user from the users array
        users = users.filter(user => user.username !== username);
        populateUserTable();
        alert('User deleted successfully!');
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user.');
    }
}

// Function to delete a shoe
async function deleteShoe(shoeId) {
    if (!confirm('Are you sure you want to delete this shoe?')) {
        return; // Exit if the user cancels
    }

    try {
        const response = await fetch(`/delete-shoe/${shoeId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete shoe');
        }

        // Filter out the deleted shoe from the shoes array
        shoes = shoes.filter(shoe => shoe.id !== shoeId);
        populateShoeTable();
        alert('Shoe deleted successfully!');
    } catch (error) {
        console.error('Error deleting shoe:', error);
        alert('An error occurred while deleting the shoe.');
    }
}

// Function to delete an order
async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) {
        return; // Exit if the user cancels
    }

    try {
        const response = await fetch(`/delete-order/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete order');
        }

        // Filter out the deleted order from the orders array
        orders = orders.filter(order => order.orderId !== orderId);
        populateOrderTable();
        alert('Order deleted successfully!');
    } catch (error) {
        console.error('Error deleting order:', error);
        alert('An error occurred while deleting the order.');
    }
}

// Event listeners for showing/hiding user, shoe, and order lists
showUsersBtn.addEventListener('click', async () => {
    if (!usersFetched) {
        await fetchUsers();
    } else {
        toggleListSection(userList, showUsersBtn, usersFetched, populateUserTable);
    }
});

showShoesBtn.addEventListener('click', async () => {
    if (!shoesFetched) {
        await fetchShoes();
    } else {
        toggleListSection(shoeList, showShoesBtn, shoesFetched, populateShoeTable);
    }
});

showOrdersBtn.addEventListener('click', async () => {
    if (!ordersFetched) {
        await fetchOrders();
    } else {
        toggleListSection(orderList, showOrdersBtn, ordersFetched, populateOrderTable);
    }
});

// Initially hide the lists
userList.style.display = 'none';
shoeList.style.display = 'none';
orderList.style.display = 'none';
