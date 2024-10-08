// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createNavbar(); // Create the navbar on page load
    updateNavbar(); // Update navbar to reflect login status
    fetchProducts(currentPage); // Fetch products on page load
    document.getElementById('searching_box').addEventListener('input', searchProducts); // Add search event listener
});

let currentPage = 1;
const itemsPerPage = 20;
let products = []; // To store all fetched products
let filteredProducts = []; // To store filtered products
let totalProducts = 0; // To keep track of total products after filtering

async function fetchProducts(page) {
    console.log('Fetching products for page:', page);
    try {
        const response = await fetch('/fetch-products');
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        products = await response.json();
        totalProducts = products.length; // Update total products
        console.log('Fetched Products:', products);
        displayProducts(page); // Display products for the current page
        updatePaginationControls(); // Update pagination
    } 
    catch (error) {
        console.error('Error fetching products:', error);
    }
}

function displayProducts(page, productsToDisplay = products) {
    const productList = document.getElementById('product_list');
    productList.innerHTML = '';

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, productsToDisplay.length);

    const productsSlice = productsToDisplay.slice(startIndex, endIndex);

    if (productsSlice.length === 0) {
        productList.innerHTML = '<p>No products found.</p>';
    } else {
        productsSlice.forEach(product => {
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
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            `;
            productList.appendChild(productItem);
        });
    }
}

function getSelectedFilters() {
    return {
        gender: Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(el => el.value),
        brand: Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(el => el.value),
        color: Array.from(document.querySelectorAll('input[name="color"]:checked')).map(el => el.value),
    };
}

function filterProducts() {
    const selectedFilters = getSelectedFilters();

    filteredProducts = products.filter(product => {
        const matchesKind = selectedFilters.gender.length === 0 || selectedFilters.gender.includes(product.kind);
        const matchesBrand = selectedFilters.brand.length === 0 || selectedFilters.brand.includes(product.brand);
        const matchesColor = selectedFilters.color.length === 0 || selectedFilters.color.includes(product.color);
        return matchesKind && matchesBrand && matchesColor;
    });

    currentPage = 1; // Reset to first page on filtering
    totalProducts = filteredProducts.length; // Update total products based on filtered results
    updatePaginationControls(); // Update pagination controls
    displayProducts(currentPage, filteredProducts); // Display the filtered products
}

// Add event listener for the filter button
document.querySelector('.btn.btn-dark').addEventListener('click', filterProducts);

function updatePaginationControls() {
    const paginationControls = document.getElementById('pagination_controls');
    paginationControls.innerHTML = ''; // Clear previous pagination buttons

    const totalPages = Math.ceil(totalProducts / itemsPerPage); // Calculate total pages based on filtered results

    // Create previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.className = 'btn btn-outline-primary me-2'; // Bootstrap margin-right
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => goToPage(currentPage - 1);
    paginationControls.appendChild(prevButton);

    // Create page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'btn btn-outline-dark mx-1'; // Bootstrap margin-x (horizontal spacing)

        // Highlight the active page
        if (i === currentPage) {
            button.classList.remove('btn-outline-dark');
            button.classList.add('btn-primary');
            button.disabled = true; // Disable the button to prevent clicking the current page
        }

        button.onclick = () => goToPage(i);
        paginationControls.appendChild(button);
    }

    // Create next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.className = 'btn btn-outline-primary ms-2'; // Bootstrap margin-left
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => goToPage(currentPage + 1);
    paginationControls.appendChild(nextButton);
}

// Go to a specific page
function goToPage(page) {
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    if (page < 1 || page > totalPages) return; // Prevent going to invalid pages
    currentPage = page;
    displayProducts(currentPage, filteredProducts.length > 0 ? filteredProducts : products); // Check if any filtered products exist
    updatePaginationControls(); // Update pagination controls after going to the new page
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(currentPage); // Fetch products for the first page
    const filterButton = document.querySelector('.btn-dark');
    if (filterButton) {
        filterButton.addEventListener('click', filterProducts);
    } else {
        console.error('Filter button not found in the DOM');
    }
});
