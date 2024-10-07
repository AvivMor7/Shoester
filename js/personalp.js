// Fetch user data from the server and populate the profile
window.onload = function() {
    fetch('/user-data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data); // Log the entire data object
            const { user, orders } = data;

            // Check if user data is defined and valid
            if (user) {
                document.getElementById("full_name").textContent = user.full_name || 'N/A';
                document.getElementById("address").textContent = user.address || 'N/A';
                document.getElementById("phone_number").textContent = user.phone_number || 'N/A';
                document.getElementById("email").textContent = user.email || 'N/A';
            } else {
                throw new Error('User data is not defined');
            }

            // Populate the orders section
            const ordersList = document.getElementById("orders-list");
            ordersList.innerHTML = ''; // Clear existing orders

            if (Array.isArray(orders) && orders.length > 0) {
                orders.forEach(order => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.innerHTML = `
                        Order #${order.order_id}: <br>
                        Products: ${order.shoes_ids.join(', ')} <br>
                        Status: Shipped
                    `;
                    ordersList.appendChild(listItem);
                });
            } else {
                const noOrdersMessage = document.createElement('li');
                noOrdersMessage.className = 'list-group-item';
                noOrdersMessage.textContent = 'No past orders to preview';
                ordersList.appendChild(noOrdersMessage);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("profile").innerHTML = `<p>Error loading user data: ${error.message}</p>`;
        });
};
