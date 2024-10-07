let cart = [];

// Fetch user cart from the server and populate the html
window.onload = function() {
    fetch('/get-cart')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(cart => {
            console.log('Fetched cart data:', cart); // Log the entire cart object

            // Check if cart is defined and has items
            if (Array.isArray(cart) && cart.length > 0) {
                populateCartItems(cart);
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

// Function to populate cart items in the DOM
function populateCartItems(cart) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        // Assuming you have a function to get shoe details like name, price, etc.
        fetch(`/shoe-details/${item.shoeId}`)
            .then(response => response.json())
            .then(shoe => {
                const shoePrice = shoe.price * item.amount;
                totalItems += item.amount;
                totalPrice += shoePrice;

                const cartItem = `
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div class="d-flex align-items-center">
                            <img src="${shoe.image}" class="img-fluid rounded-3" style="width: 120px;" alt="${shoe.name}">
                            <div class="ms-3">
                                <h5>${shoe.name}</h5>
                                <p class="small mb-0">Amount: ${item.amount}</p>
                            </div>
                        </div>
                        <div>
                            <h5 class="mb-0">€${shoePrice.toFixed(2)}</h5>
                        </div>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', cartItem);

                // Update items and total price
                document.querySelector('.items').textContent = `Items ${totalItems}`;
                document.querySelector('.total-price').textContent = `€ ${totalPrice.toFixed(2)}`;
            })
            .catch(error => {
                console.error('Error fetching shoe details:', error);
            });
    });
}



// Function to update quantities and calculate the total price
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const itemsElement = document.querySelector('.items');
    const totalPriceElement = document.querySelector('.total-price');
    const badgeElement = document.querySelector('.btn-outline-dark .badge');

    // Ensure these elements exist before trying to manipulate them
    if (!cartItemsContainer || !itemsElement || !totalPriceElement || !badgeElement) {
        console.error("Cart items container or required elements not found in the DOM.");
        return;
    }

    let totalItems = 0;
    let totalPrice = 0;
    cartItemsContainer.innerHTML = ''; // Clear the previous content

    // Only calculate if there are items in the cart
    if (cart.length > 0) {
        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.quantity * item.price;

            // Dynamically inject cart items into HTML
            const itemHTML = `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h5 class="text-uppercase">${item.name}</h5>
                        <p>${item.kind} - ${item.color}</p>
                        <p>Price: €${item.price.toFixed(2)}</p>
                    </div>
                    <div class="d-flex align-items-center">
                        <button onclick="decrementQuantity('${item.id}')" class="btn btn-sm btn-outline-secondary">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button onclick="incrementQuantity('${item.id}')" class="btn btn-sm btn-outline-secondary">+</button>
                    </div>
                    <button onclick="removeItem('${item.id}')" class="btn btn-sm btn-danger">Remove</button>
                </div>
                <hr class="my-4">
            `;
            cartItemsContainer.innerHTML += itemHTML;
        });

        // Display items count and total price
        itemsElement.textContent = `Items ${totalItems}`;
        totalPriceElement.textContent = `€ ${totalPrice.toFixed(2)}`;
    } else {
        // If cart is empty, show default values
        itemsElement.textContent = "Items 0";
        totalPriceElement.textContent = "€ 0.00";
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    }

    // Update cart badge in the navigation
    badgeElement.textContent = totalItems;
    saveCart(); // Save the updated cart
}

// Increment quantity of an item
function incrementQuantity(itemId) {
    cart = cart.map(item => {
        if (item.id === itemId) {
            item.quantity += 1;
        }
        return item;
    });
    updateCart();
}

// Decrement quantity of an item
function decrementQuantity(itemId) {
    cart = cart.map(item => {
        if (item.id === itemId && item.quantity > 1) {
            item.quantity -= 1;
        }
        return item;
    });
    updateCart();
}

// Remove an item from the cart
function removeItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

// On page load, initialize the cart
document.addEventListener("DOMContentLoaded", function() {
    loadCart();
    updateCart();
});

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Function to add an item to the cart
function addToCart(id, kind, brand, color, price, itemQuantity) {
    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        // If it exists, increment the quantity
        existingItem.quantity += itemQuantity;
    } else {
        // If it doesn't exist, add a new item to the cart
        cart.push({ id: id, kind: kind, name: brand, color: color, price: price, quantity: itemQuantity });
    }

    // Update the cart totals and item count in the UI
    updateCart();
}
document.addEventListener("DOMContentLoaded", function () {
    updateCart();
});

