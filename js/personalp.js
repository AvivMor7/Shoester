window.onload = function () {
    fetch('/user-data')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data); // Log the data of the object
            const { user, orders } = data;
            console.log('Orders:', orders); // Log the orders to check its structure

            // Check if user defined and valid
            if (user) {
                // Populate the profile section
                document.getElementById("full_name").textContent = user.full_name || 'N/A';
                document.getElementById("address").textContent = user.address || 'N/A';
                document.getElementById("phone_number").textContent = user.phone_number || 'N/A';
                document.getElementById("email").textContent = user.email || 'N/A';

                // reset the edit form
                document.getElementById("editName").value = user.full_name || '';
                document.getElementById("editAddress").value = user.address || '';
                document.getElementById("editPhoneNumber").value = user.phone_number || '';
                document.getElementById("editEmail").value = user.email || '';
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

                    
                    if (Array.isArray(order.shoes_ids) && order.shoes_ids.length > 0) {
                        const shoeIds = order.shoes_ids.join(', '); // Creating a string with the shoe IDs

                        // Fetch shoe details from the server for each shoe ID
                        fetch(`/fetch-shoes-by-ids?ids=${shoeIds}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`Failed to fetch shoes, status: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(shoes => {
                                if (Array.isArray(shoes) && shoes.length > 0) {
                                    // Use order.shoes_ids.map() to render images including duplicates
                                    const shoeImagesHTML = order.shoes_ids.map(shoeId => {
                                        const shoe = shoes.find(shoe => shoe.id === shoeId); // Find the matching shoe object by ID
                                        return shoe ? `<img src="${shoe.url}" alt="shoe image" style="max-width: 100px; margin-right: 10px;">` : '';
                                    }).join(' ');

                                    listItem.innerHTML = `
                                        Order #${order.order_id}: <br>
                                        Products: ${shoeIds} <br>
                                        Images: <br> ${shoeImagesHTML} <br>
                                        Status: Shipped <br>
                                        Total price: ${order.price}$
                                    `;
                                } else {
                                    listItem.innerHTML = `
                                        Order #${order.order_id}: <br>
                                        Products: ${shoeIds} <br>
                                        Status: Shipped, but no shoe details found <br>
                                        Total price: ${order.price}$
                                    `;
                                }
                                ordersList.appendChild(listItem);
                            })
                            .catch(error => {
                                console.error('Error fetching shoe details:', error);
                                listItem.innerHTML = `
                                    Order #${order.order_id}: <br>
                                    Products: ${shoeIds} <br>
                                    Status: Shipped, but failed to load shoe details <br>
                                    Total price: ${order.price}$
                                `;
                                ordersList.appendChild(listItem);
                            });
                    } else {
                        // Handle cases where there are no shoes in the order 
                        listItem.innerHTML = `
                            Order #${order.order_id}: <br>
                            No products available <br>
                            Status: Shipped <br>
                            Total price: ${order.price}$
                        `;
                        ordersList.appendChild(listItem);
                    }
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

// Edit profile button logic 
const editProfileBtn = document.getElementById("editProfileBtn");
const editProfileSection = document.getElementById("editProfileSection");
const profileSection = document.getElementById("profile");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editProfileForm = document.getElementById("editProfileForm");

// Show the edit form when the "Edit Profile" button is clicked
editProfileBtn.addEventListener('click', function () {
    profileSection.style.display = 'none';  // Hide profile view
    editProfileSection.style.display = 'block';  // Show the edit form
});

// Hide the edit form when the "Cancel" button is clicked
cancelEditBtn.addEventListener('click', function () {
    editProfileSection.style.display = 'none';  
    profileSection.style.display = 'block';  
});

// Handle the form submission
editProfileForm.addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent the form from submitting normally

    const updatedProfile = {
        full_name: document.getElementById("editName").value,
        address: document.getElementById("editAddress").value,
        phone_number: document.getElementById("editPhoneNumber").value,
        email: document.getElementById("editEmail").value,
    };

    // Send updated profile to the server
    fetch('/update-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Profile updated successfully:', data);
            // Update the UI with the new data
            document.getElementById("full_name").textContent = updatedProfile.full_name;
            document.getElementById("address").textContent = updatedProfile.address;
            document.getElementById("phone_number").textContent = updatedProfile.phone_number;
            document.getElementById("email").textContent = updatedProfile.email;

            // Switch back to the profile view and hide the edit form
            editProfileSection.style.display = 'none';
            profileSection.style.display = 'block';
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        });
});
