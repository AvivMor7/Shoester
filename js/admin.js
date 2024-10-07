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

//extra insurance gaurding the admin page on client side
document.addEventListener('DOMContentLoaded', () => {
    fetch('/session-check') // Create an endpoint to check session
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Session not found');
        }
    })
    .then(data => {
        if (!data.loggedIn || !data.user.is_admin) {
            // If the user is not logged in or not an admin, redirect
            window.location.href = '/landing_page.html';
        }
    })
    .catch(error => {
        console.error('Error checking session:', error);
        window.location.href = '/landing_page.html'; // Redirect on error
    });
});


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
        const response = await fetch('/fetch-users');
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
    shoeTableBody.innerHTML = '';

    // Populate the table with shoe data
    if (shoes.length === 0) {
        shoeTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No shoes available</td></tr>';
    } else {
        shoes.forEach(shoe => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', shoe.id);
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
    orderTableBody.innerHTML = '';

    // Populate the table with order data
    if (orders.length === 0) {
        orderTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No past orders available</td></tr>';
    } else {
        orders.forEach(order => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', order.order_id);
            row.innerHTML = `
                <td>${order.username}</td>
                <td>${order.order_id}</td>
                <td>${order.shoes_ids}</td>
                <td><button class="btn btn-danger" onclick="deleteOrder('${order.order_id}')">Delete Order</button></td>
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

        // Immediately update the table
        populateUserTable();  // Re-render the user table
        alert('User deleted successfully!');
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user.');
    }
}

// Function to delete a shoe
async function deleteShoe(id) {
    if (!confirm('Are you sure you want to delete this shoe?')) {
        return; // Exit if the user cancels
    }

    try {
        const response = await fetch(`/delete-shoe/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete shoe');
        }

        // Filter out the deleted shoe from the shoes array
        shoes = shoes.filter(shoe => shoe.id !== id);
        // Re-render the shoe table immediately after deletion, without hiding or showing it
        const rowToRemove = document.querySelector(`#shoeTableBody tr[data-id="${id}"]`);
        if (rowToRemove) {
            rowToRemove.remove();
        }

        alert('Shoe deleted successfully!');
    } catch (error) {
        console.error('Error deleting shoe:', error);
        alert('An error occurred while deleting the shoe.');
    }
}

// Function to delete an order
async function deleteOrder(order_id) {
    if (!confirm('Are you sure you want to delete this order?')) {
        return; // Exit if the user cancels
    }

    try {
        const response = await fetch(`/delete-order/${order_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete order');
        }

        // Filter out the deleted order from the orders array
        orders = orders.filter(order => order.order_id !== order_id);

        const rowToRemove = document.querySelector(`#orderTableBody tr[data-id="${order_id}"]`);
        if (rowToRemove) {
            rowToRemove.remove();
        }

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



// Fetch and plot sales by brand chart
async function fetchSalesByBrandData() {
    try {
        const ordersResponse = await fetch('/fetch-orders');
        const shoesResponse = await fetch('/fetch-shoes');

        if (!ordersResponse.ok || !shoesResponse.ok) {
            throw new Error('Network response was not ok');
        }

        const orders = await ordersResponse.json();
        const shoes = await shoesResponse.json();

        console.log('Orders:', orders);  // Log the orders to inspect the data
        console.log('Shoes:', shoes);    // Log the shoes to inspect the data

        // Create a map of shoe ids to brands
        const shoeMap = shoes.reduce((acc, shoe) => {
            acc[shoe.id] = shoe.brand;  // Use `shoe.id` to map the shoe's id to its brand
            return acc;
        }, {});

        console.log('Shoe Map:', shoeMap);  // Log the map of shoe IDs to brands

        // Aggregate sales by brand
        const brandSales = {};

        // Iterate over orders and aggregate sales
        orders.forEach(order => {
            let shoeIds;

            // Check if order.shoes_ids is already an array or a comma-separated string
            if (Array.isArray(order.shoes_ids)) {
                shoeIds = order.shoes_ids;
            } else if (typeof order.shoes_ids === 'string') {
                shoeIds = order.shoes_ids.split(',');  // Split if it's a string
            } else {
                console.warn('Unexpected type for shoes_ids:', typeof order.shoes_ids);
                return; // Skip this order if shoes_ids is not an array or string
            }

            console.log('Processing Order:', order);  // Log each order
            console.log('Shoe IDs:', shoeIds);        // Log the shoe IDs in the order

            // For each shoe_id in the order, get the brand and update the sales count
            shoeIds.forEach(shoeId => {
                const brand = shoeMap[shoeId];  // Get the brand for the given shoe_id

                // If the shoe_id is found in the shoeMap (i.e. the brand exists), increment the count
                if (brand) {
                    brandSales[brand] = (brandSales[brand] || 0) + 1;
                } else {
                    console.warn(`Shoe with ID ${shoeId} not found in shoeMap.`);
                }
            });
        });

        console.log('Brand Sales:', brandSales);  // Log the aggregated sales by brand

        const brandNames = Object.keys(brandSales);
        const salesCounts = Object.values(brandSales);

        console.log('Brand Names:', brandNames);  // Log brand names (X-axis labels)
        console.log('Sales Counts:', salesCounts);  // Log sales counts (Y-axis values)

        if (brandNames.length === 0 || salesCounts.length === 0) {
            console.log('No sales data to display in the chart.');
        }

        // Create the chart
        const ctx = document.getElementById('brandSalesChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: brandNames,
                datasets: [{
                    label: 'Number of Shoes Sold',
                    data: salesCounts,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching order or shoe data:', error);
    }
}

// Call fetchSalesByBrandData to populate the chart when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchSalesByBrandData();
});




async function fetchSalesByKindData() {
    try {
        const ordersResponse = await fetch('/fetch-orders');
        const shoesResponse = await fetch('/fetch-shoes');

        if (!ordersResponse.ok || !shoesResponse.ok) {
            throw new Error('Network response was not ok');
        }

        const orders = await ordersResponse.json();
        const shoes = await shoesResponse.json();

        // Create a map of shoe ids to brands and kinds
        const shoeMap = shoes.reduce((acc, shoe) => {
            acc[shoe.id] = {
                brand: shoe.brand,
                kind: shoe.kind  // Added 'kind' to the map
            };
            return acc;
        }, {});

        // Aggregate sales by kind
        const kindSales = {};

        // Iterate over orders and aggregate sales by kind
        orders.forEach(order => {
            let shoeIds;

            if (Array.isArray(order.shoes_ids)) {
                shoeIds = order.shoes_ids;
            } else if (typeof order.shoes_ids === 'string') {
                shoeIds = order.shoes_ids.split(',');  // Split if it's a string
            } else {
                console.warn('Unexpected type for shoes_ids:', typeof order.shoes_ids);
                return; // Skip this order if shoes_ids is not an array or string
            }

            shoeIds.forEach(shoeId => {
                const { kind } = shoeMap[shoeId] || {};  // Get the kind for the given shoe_id

                if (kind) {
                    kindSales[kind] = (kindSales[kind] || 0) + 1;
                }
            });
        });

        const kindNames = Object.keys(kindSales);
        const kindSalesCounts = Object.values(kindSales);

        // Create the chart for kind sales
        const kindCtx = document.getElementById('kindSalesChart').getContext('2d');
        new Chart(kindCtx, {
            type: 'bar',
            data: {
                labels: kindNames,
                datasets: [{
                    label: 'Number of Shoes Sold by Kind',
                    data: kindSalesCounts,
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error fetching order or shoe data:', error);
    }
}

// Call the fetchSalesByKindData function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchSalesByKindData();
});
