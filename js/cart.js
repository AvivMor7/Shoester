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
  
  // Update cart and save it to localStorage
  function updateCart() {
    // Same logic as above
    saveCart();
  }
  
  // On page load, load the cart from localStorage and initialize it
  document.addEventListener("DOMContentLoaded", function() {
    loadCart();
    updateCart();
  });
  // Function to add an item to the cart
function addToCart(id, kind, brand, color, price, itemQuantity) {
    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.id === itemId);
  
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
  
  