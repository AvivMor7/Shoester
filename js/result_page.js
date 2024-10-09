// Call the function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts(currentPage);
    // Check the URL for parameters and apply filters
    applyFiltersBasedOnUrl();
    document.getElementById('searching_box').addEventListener('input', searchProducts);

    // Add listener for 'Enter' key on search box to trigger search and update URL
    document.getElementById('searching_box').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = document.getElementById('searching_box').value;
            if (query.trim()) {
                // Update the URL with the new search query
                const newUrl = `result_page.html?query=${encodeURIComponent(query)}`;
                window.history.pushState({}, '', newUrl); // Change the URL without reloading the page
                searchProducts(); // Trigger the search with the new query
            }
        }
    });
});

let currentPage = 1;
const itemsPerPage = 24;
let products = []; // Storing all fetched products
let filteredProducts = []; // Storing the filtered products
let totalProducts = 0;

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
        filteredProducts = [...products]; // Initialize filtered products to be a copy of products
        totalProducts = products.length; // Update total products
        console.log('Fetched Products:', products);
        displayProducts(page);
        updatePaginationControls(); // Update the pagination parameters
        applyFiltersBasedOnUrl();

    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Display the products based on the current page
function displayProducts(page, productsToDisplay = filteredProducts) {
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

// Search function for filtering the products
function searchProducts() {
    const query = new URLSearchParams(window.location.search).get('query'); // Get query from URL
    if (!query) return; // Exit if there's no search query

    const keywords = decodeURIComponent(query).toLowerCase().split(' '); // Decode and split into keywords

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

    console.log('Filtered Products:', filteredProducts);
    currentPage = 1; // Reset to first page after search
    updatePaginationControls(); // Update pagination controls based on filtered products
    displayProducts(currentPage, filteredProducts);
}

// Handle Enter key for triggering search
function checkEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the form from submitting
        searchProducts(); // Call the search function
    }
}

// Apply filters based on URL parameters
function applyFiltersBasedOnUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const genderParam = urlParams.get('gender'); // Get the gender parameter from the URL
    const queryParam = urlParams.get('query'); // Check if there is a search query

    if (queryParam) {
        searchProducts(); // Call search function if a query exists
        return; // Exit if there's a query parameter
    }

    if (!genderParam) {
        console.log('No gender parameter in the URL. Not applying filters.');
        return; // Exit if there's no gender parameter
    }

    // Filter logic based on gender
    if (genderParam === 'men') {
        filterProducts(menFilters);
    } else if (genderParam === 'women') {
        filterProducts(womenFilters);
    } else if (genderParam === 'kids') {
        filterProducts(kidsFilters);
    }
}

// Filter the products based on selected filters
function filterProducts(filters) {
    const selectedFilters = filters || getSelectedFilters();

    filteredProducts = products.filter(product => {
        const matchesKind = selectedFilters.gender.length === 0 || selectedFilters.gender.includes(product.kind);
        const matchesBrand = selectedFilters.brand.length === 0 || selectedFilters.brand.includes(product.brand);
        const matchesColor = selectedFilters.color.length === 0 || selectedFilters.color.includes(product.color);
        return matchesKind && matchesBrand && matchesColor;
    });

    currentPage = 1; // Reset to first page on filtering
    totalProducts = filteredProducts.length; // Update total products based on the result
    updatePaginationControls(); 
    displayProducts(currentPage, filteredProducts); 
}

// Event listener for the filter button
document.querySelector('.btn.btn-dark').addEventListener('click', function() {
    const selectedFilters = {
        gender: Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(el => el.value),
        brand: Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(el => el.value),
        color: Array.from(document.querySelectorAll('input[name="color"]:checked')).map(el => el.value),
    };

    history.replaceState({}, document.title, "result_page.html"); // Change to the default URL

    filterProducts(selectedFilters);
});

// Controlling the moving between the pages
function updatePaginationControls() {
    const paginationControls = document.getElementById('pagination_controls');
    paginationControls.innerHTML = ''; // Clear previous pagination buttons

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); // Calculating how many pages are needed

    // Previous button
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
            button.disabled = true; // Disable pressing a pressed button
        }

        button.onclick = () => goToPage(i);
        paginationControls.appendChild(button);
    }

    // Next button
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
    displayProducts(currentPage, filteredProducts);
    updatePaginationControls();
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
    .then(data => {
        console.log('Item added to cart:', data);
        alert('Item added to cart!');
    })
    .catch(error => console.error('Error adding item to cart:', error));
}
