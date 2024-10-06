let cart = [];

// Function to update quantities and calculate the total price
function updateCart() {
    let totalItems = 0;
    let totalPrice = 0;

    // Only calculate if there are items in the cart
    if (cart.length > 0) {
        cart.forEach(item => {
            totalItems += item.quantity;
            totalPrice += item.quantity * item.price;
        });

        // Display items count and total price
        document.querySelector(".items").textContent = `Items ${totalItems}`;
        document.querySelector(".total-price").textContent = `€ ${totalPrice.toFixed(2)}`;
    } else {
        // If cart is empty, show default values
        document.querySelector(".items").textContent = "Items 0";
        document.querySelector(".total-price").textContent = "€ 0.00";
    }

    // Update cart badge in the navigation
    document.querySelector('.btn-outline-dark .badge').textContent = totalItems;
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
