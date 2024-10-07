// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchProducts);

let currentPage = 1;
const itemsPerPage = 20;
let products = []; // To store all fetched products
let totalProducts = 0; // To keep track of total products after filtering

async function fetchProducts(page) {
    console.log('Fetching products for page:', page); // Log current page
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

// Function to display products based on the current page or filters
function displayProducts(page, filteredProductsList = null) {
    const productList = document.getElementById('product_list');
    productList.innerHTML = '';

    // Determine which products to display
    const productsToDisplay = filteredProductsList || products;
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
// Function to display products based on the current page or filters
function displayProducts(page, filteredProductsList = null) {
    const productList = document.getElementById('product_list');
    productList.innerHTML = '';

    // Determine which products to display
    const productsToDisplay = filteredProductsList || products;
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

// Function to get selected filters
function getSelectedFilters() {
    const selectedFilters = {
        gender: Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(el => el.value),
        brand: Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(el => el.value),
        color: Array.from(document.querySelectorAll('input[name="color"]:checked')).map(el => el.value),
    };
    return selectedFilters;
}

// Function to filter products based on selected filters
function filterProducts() {
    const selectedFilters = getSelectedFilters();

    console.log('Selected Filters:', selectedFilters); // Debugging
    const filtered = products.filter(product => {
        const matcheskind = selectedFilters.gender.length === 0 || selectedFilters.gender.includes(product.kind);
        const matchesBrand = selectedFilters.brand.length === 0 || selectedFilters.brand.includes(product.brand);
        const matchesColor = selectedFilters.color.length === 0 || selectedFilters.color.includes(product.color);
        return matcheskind && matchesBrand && matchesColor;
    });

    console.log('Filtered Products Count:', filtered.length); // Debugging

    currentPage = 1; // Reset to first page on filtering
    totalProducts = filtered.length; // Update total products based on filtered results
    updatePaginationControls(); // Update pagination controls
    displayProducts(currentPage, filtered); // Display the filtered products
}

// Update pagination controls based on current page
function addToCart(shoeId) {
    // Prepare the data to be sent in the request body
    const data = {
        shoeId: shoeId,
    };
    console.log(shoeId);
    // Make a POST request to /add-to-cart
    fetch('/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        alert('Item added to cart!');
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
        alert('Error adding item to cart. Please try again.');
    });
}

// divide to different pages
function goToPage(page) {
    currentPage = page;
    fetchProducts(currentPage);
    updatePaginationControls();
}

function updatePaginationControls() {
    const paginationControls = document.getElementById('pagination_controls');
    paginationControls.innerHTML = '';

    const totalPages = Math.ceil(totalProducts / itemsPerPage); // Calculate total pages for current filter
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.disabled = (i === currentPage); // Disable button for current page
        button.onclick = () => goToPage(i);
        paginationControls.appendChild(button);
    }
}

// Go to a specific page
function goToPage(page) {
    currentPage = page;
    displayProducts(currentPage);
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
