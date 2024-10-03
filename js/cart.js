let cart = [
{ id: 1, name: 'Cotton T-shirt', price: 44.00, quantity: 1 },
{ id: 2, name: 'Cotton T-shirt', price: 44.00, quantity: 1 },
{ id: 3, name: 'Cotton T-shirt', price: 44.00, quantity: 1 }
];

// Function to update quantities and calculate the total price
function updateCart() {
let totalItems = 0;
let totalPrice = 0;

cart.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.quantity * item.price;
});

// Update the items and price in the DOM
document.querySelector(".text-uppercase.items").textContent = `Items ${totalItems}`;
document.querySelector(".total-price").textContent = `€ ${totalPrice.toFixed(2)}`;
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
updateCart();
});