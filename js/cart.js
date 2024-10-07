let cart = [];

// Fetch user cart from the server and populate the HTML
window.onload = function() {
    fetch('/get-cart')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(cart => {
            // Check if cart is defined and has items
            if (Array.isArray(cart) && cart.length > 0) {
                getShoesFromCart(cart); // Fetch shoes based on cart data
            } else {
                // Display empty cart message if no items
                document.getElementById("cart-items").innerHTML = '<p>Your cart is empty</p>';
                document.querySelector('.items').textContent = 'Items 0';
                document.querySelector('.total-price').textContent = '€ 0.00';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("cart-items").innerHTML = `<p>Error loading cart data: ${error.message}</p>`;
        });
};

// Function to get shoes based on cart items
async function getShoesFromCart(cart) {
    try {
        const response = await fetch('/getShoesFromCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cart) // Send the cart object
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const shoes = await response.json();
        populateCartItems(shoes, cart); // Pass both shoes and original cart to populate
    } catch (error) {
        console.error('Error fetching shoes:', error);
        document.getElementById("cart-items").innerHTML = `<p>Error loading shoes: ${error.message}</p>`;
    }
}

// Populate cart items with shoe details
async function populateCartItems(shoes, cart) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items
    let totalItems = 0;
    let totalPrice = 0;

    // Iterate through the shoes array
    for (const shoe of shoes) {
        // Find the corresponding cart item based on shoe ID
        const cartItem = cart.find(item => {
            return item.shoeId === shoe.id;
        });

        if (cartItem) {
            const shoePrice = shoe.price * cartItem.amount; // Calculate the total price for this shoe
            totalItems += cartItem.amount; // Update total items
            totalPrice += shoePrice; // Update total price

            const cartItemHTML = `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="d-flex align-items-center">
                        <img src="${shoe.url}" class="img-fluid rounded-3" style="width: 180px;" alt="${shoe.kind}">
                        <div class="ms-3">
                            <h5>${shoe.kind}  <i class="bi bi-arrow-right"></i>  ${shoe.brand}</h5>
                            <p class="small mb-0">Amount: ${cartItem.amount}</p>
                        </div>
                    </div>
                    <div>
                        <h5 class="mb-0">$${shoePrice.toFixed(2)}</h5>
                    </div>
                </div>
                <hr class="my-4">
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        } else {
            console.warn(`No corresponding cart item found for shoe ID: ${shoe.id}`); // Warn if no cart item matches
        }
    }

    // Update items and total price in the UI
    document.querySelector('.items').textContent = `${totalItems} Items`;
    document.querySelector('.total-price').textContent = `$ ${totalPrice.toFixed(2)}`;
}

async function checkout() {
    try {
        const response = await fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Cart cleared and order placed! Your Order ID is: ${data.order_id}`);
            window.location.reload(); // Refresh the page after the alert
        } else {
            alert(data.message || 'Error clearing the cart.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}
