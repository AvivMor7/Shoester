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

function searchProducts() {
    const query = document.getElementById('searching_box').value.toLowerCase();
    const filteredProducts = products.filter(product => {
        return (
            product.brand.toLowerCase().includes(query) ||
            product.kind.toLowerCase().includes(query) ||
            product.color.toLowerCase().includes(query) ||
            product.price.toString().includes(query)
        );
    });

    displayProducts(currentPage, filteredProducts); // Display the filtered products
}
function checkEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the form from submitting
        searchProducts(); // Call the search function
    }
}

function getSelectedFilters() {
    const selectedFilters = {
        gender: Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(el => el.value),
        brand: Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(el => el.value),
        color: Array.from(document.querySelectorAll('input[name="color"]:checked')).map(el => el.value),
    };
    return selectedFilters;
}

function filterProducts() {
    const selectedFilters = getSelectedFilters();

    const filtered = products.filter(product => {
        const matchesKind = selectedFilters.gender.length === 0 || selectedFilters.gender.includes(product.kind);
        const matchesBrand = selectedFilters.brand.length === 0 || selectedFilters.brand.includes(product.brand);
        const matchesColor = selectedFilters.color.length === 0 || selectedFilters.color.includes(product.color);
        return matchesKind && matchesBrand && matchesColor;
    });

    currentPage = 1; // Reset to first page on filtering
    totalProducts = filtered.length; // Update total products based on filtered results
    updatePaginationControls(); // Update pagination controls
    displayProducts(currentPage, filtered); // Display the filtered products
}

// Add event listener for the filter button
document.querySelector('.btn.btn-dark').addEventListener('click', filterProducts);

function updatePaginationControls() {
    // Your pagination logic here (ensure totalProducts is defined)
    console.log('Total products:', totalProducts);
    // Logic to update pagination controls goes here...
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
        button.style.borderRadius = '50px'; // Rounded corners

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
