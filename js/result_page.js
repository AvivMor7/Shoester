// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(currentPage); // Fetch products on page load
    // Check for query parameters and perform search if necessary
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('query')) {
        searchProducts(); // Search using the query parameter from the URL
    }
    document.getElementById('searching_box').addEventListener('input', searchProducts);

});

// Constants and variables
let currentPage = 1;
const itemsPerPage = 20;
let products = []; // To store all fetched products
let filteredProducts = []; // To store filtered products
let totalProducts = 0; // To keep track of total products after filtering

const menFilters = {
    gender: ['men'],
    brand: [],
    color: []
};

const womenFilters = {
    gender: ['women'],
    brand: [],
    color: []
};

const kidsFilters = {
    gender: ['kids'],
    brand: [],
    color: []
};

// Fetch products from the server
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

        // Apply filters based on URL AFTER fetching the products
        applyFiltersBasedOnUrl();

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display products based on the current page
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


function searchProducts() {
    const query = document.getElementById('searching_box').value.toLowerCase();
    const keywords = query.split(' ');

    filteredProducts = products.filter(product => {
        return keywords.every(keyword => {
            return (
                product.brand.toLowerCase().includes(keyword) ||
                product.kind.toLowerCase().includes(keyword) ||
                product.color.toLowerCase().includes(keyword) ||
                product.price.toString().includes(keyword)
            );
        });
    });

    currentPage = 1; // Reset to first page after search
    updatePaginationControls(); // Update pagination controls based on filtered products
    displayProducts(currentPage, filteredProducts); // Display the filtered products
}


function checkEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the form from submitting
        searchProducts(); // Call the search function
    }
}

// Apply filters based on URL query parameters
function applyFiltersBasedOnUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const genderParam = urlParams.get('gender'); // Get the 'gender' parameter from the URL

    if (!genderParam) {
        console.log('No gender parameter in the URL. Not applying filters.');
        return; // Exit if there's no gender parameter
    }

    // Existing filtering logic
    if (genderParam === 'men') {
        filterProducts(menFilters);
    } else if (genderParam === 'women') {
        filterProducts(womenFilters);
    } else if (genderParam === 'kids') {
        filterProducts(kidsFilters);
    }
}

// Filter products based on selected filters
function filterProducts(filters) {
    const selectedFilters = filters || getSelectedFilters();

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


// Event listener for the filter button
document.querySelector('.btn.btn-dark').addEventListener('click', function() {
    const selectedFilters = {
        gender: Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(el => el.value),
        brand: Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(el => el.value),
        color: Array.from(document.querySelectorAll('input[name="color"]:checked')).map(el => el.value),
    };

    // Update the URL to remove query parameters after pressing the filter button
    history.replaceState({}, document.title, "result_page.html"); // Change to your default URL

    filterProducts(selectedFilters);
});

function updatePaginationControls() {
    const paginationControls = document.getElementById('pagination_controls');
    paginationControls.innerHTML = ''; // Clear previous pagination buttons

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); // Use filteredProducts for total pages

    // Create previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.className = 'btn btn-outline-primary me-2';
    prevButton.disabled = currentPage === 1;
    prevButton.onclick = () => goToPage(currentPage - 1);
    paginationControls.appendChild(prevButton);

    // Create page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = 'btn btn-outline-dark mx-1';

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
    nextButton.className = 'btn btn-outline-primary ms-2';
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => goToPage(currentPage + 1);
    paginationControls.appendChild(nextButton);
}


function goToPage(page) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (page < 1 || page > totalPages) return; // Prevent going to invalid pages
    currentPage = page;
    displayProducts(currentPage, filteredProducts); // Use filteredProducts for display
    updatePaginationControls(); // Update pagination controls
}


// Add an item to the cart
function addToCart(shoeId) {
    const data = { shoeId: shoeId };
    console.log(shoeId);

    fetch('/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
