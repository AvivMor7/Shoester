let products = [];
async function fetchProducts() {
    console.log('Fetching products...'); // Log fetching action
    try {
        const response = await fetch('/fetch-products');
        console.log('Response status:', response.status); // Log response status
        products = await response.json();
        console.log('Fetched products:', products); // Log the fetched products

        // Get the product-list div
        const productList = document.getElementById('product_list');
        productList.innerHTML = ''; // Clear existing content

        if (products.length === 0) {
            productList.innerHTML = '<p>No products found.</p>';
        } else {
            // Create elements for each product and append to product-list
            products.forEach(product => {
                const productItem = document.createElement('div');
                productItem.innerHTML = `
                    <h2>${product.brand}</h2>
                    <p>Kind: ${product.kind}</p>
                    <p>Price: $${product.price}</p>
                    <p>Sizes: ${product.size.join(', ')}</p>
                    <img src="${product.url}" alt="${product.kind}" style="width:100px;height:auto;">
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
