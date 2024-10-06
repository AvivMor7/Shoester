async function fetchProducts() {
    console.log('Fetching products...'); // Log fetching action
    try {
        const response = await fetch('/fetch-shoes'); // Ensure endpoint matches
        console.log('Response status:', response.status); // Log response status
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        products = await response.json();
        console.log('Product URLs:', products.map(product => product.url));

        // Get the product-list div
        const productList = document.getElementById('product_list');
        productList.innerHTML = ''; // Clear existing content

        if (products.length === 0) {
            productList.innerHTML = '<p>No products found.</p>';
        } else {
            // Create elements for each product and append to product-list
            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item'; // Add a class for styling
                productItem.innerHTML = `
                    <div class="card mb-3">
                        <img src="${product.url}" alt="${product.kind}" class="card-img-top product-image" onerror="this.onerror=null; this.src='assets/placeholder.jpg';">
                        <div class="card-body">
                            <h5 class="card-title">${product.brand}</h5>
                            <p class="card-text">Kind: ${product.kind}</p>
                            <p class="card-text">Price: $${product.price}</p>
                            <p class="card-text">Sizes: ${product.size.join(', ')}</p>
                            <p class="card-text">Color: ${product.color}</p> <!-- Add color -->
                        </div>
                    </div>
                `;
                productList.appendChild(productItem);

            });
        }
    } 
    catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchProducts);
