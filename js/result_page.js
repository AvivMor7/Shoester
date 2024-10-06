let currentPage = 1;
const itemsPerPage = 20;
const totalProducts = 76; // Total number of products
const totalPages = Math.ceil(totalProducts / itemsPerPage); // Calculate total pages

async function fetchProducts(page) {
    console.log('Fetching products for page:', page); // Log current page
    try {
        const response = await fetch('/fetch-shoes');
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        products = await response.json();
        console.log('Fetched Products:', products);

        const productList = document.getElementById('product_list');
        productList.innerHTML = '';

        // Calculate start and end indices for slicing
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = page === totalPages ? totalProducts : startIndex + itemsPerPage;

        const productsToDisplay = products.slice(startIndex, endIndex);

        if (productsToDisplay.length === 0) {
            productList.innerHTML = '<p>No products found.</p>';
        } else {
            productsToDisplay.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <div class="card mb-3">
                        <img src="${product.url}" alt="${product.kind}" class="card-img-top product-image" onerror="this.onerror=null; this.src='assets/placeholder.jpg';">
                        <div class="card-body">
                            <h5 class="card-title">${product.brand}</h5>
                            <p class="card-text">Kind: ${product.kind}</p>
                            <p class="card-text">Price: $${product.price}</p>
                            <p class="card-text">Sizes: ${product.size.join(', ')}</p>
                            <p class="card-text">Color: ${product.color}</p>
                           <input type="number" min="1" value="1" id="quantity-${product.id}" class="form-control mb-2" />
                            <button class="btn btn-primary" onclick="addToCart('${product.id}', '${product.kind}', '${product.brand}', '${product.color}', ${product.price}, document.getElementById('quantity-${product.id}').value)">Add to Cart</button>
                        </div>
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

// divide to different pages
function goToPage(page) {
    currentPage = page;
    fetchProducts(currentPage);
    updatePaginationControls();
}

function updatePaginationControls() {
    const paginationControls = document.getElementById('pagination_controls');
    paginationControls.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.disabled = (i === currentPage); // Disable button for current page
        button.onclick = () => goToPage(i);
        paginationControls.appendChild(button);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(currentPage); // Fetch products for the first page
    updatePaginationControls(); // Initialize pagination controls
});


