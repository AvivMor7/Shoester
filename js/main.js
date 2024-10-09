function createNavbar() {
    const navbarHTML = `
        <nav id="navbar" class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container px-4 px-lg-4">
                <img src="../assets/favicon.ico" style="height: 60px; padding-right: 15px;" />
                <a class="navbar-brand" href="landing_page.html">Shoester</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4" style="padding-left: 0; padding-right: 0;">
                        <li class="nav-item" style="margin-right: 20px;"><a class="nav-link" href="contacts_page.html">Contact</a></li>
                        <li class="nav-item" id="personalPageLink" style="display: none; margin-right: 20px;"><a class="nav-link" href="personal_page.html" class="auth-link">Profile</a></li>
                    </ul>
                    <div class="input-group rounded" id="search">
                        <input type="search" id="searching_box" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" onkeypress="checkEnter(event)" style="margin-right: 20px;border-radius:50px;" />
                    </div>
                    <form class="d-flex" style="margin-left: auto;">
                        <a href="cart.html" id="cart_button" class="btn btn-outline-dark d-flex align-items-center justify-content-center" role="button">
                            <i class="bi-cart-fill" style="font-size: 1.2rem; margin-right: 5px;"></i>
                            Cart
                        </a>
                        <a href="login_page.html" id="loginButton" class="btn btn-outline-primary ms-2" style="display: inline;">
                            <i class="bi bi-person"></i>
                            Login
                        </a>
                        <a href="#" id="logoutButton" class="btn btn-outline-danger ms-2" style="display: none;">
                            <i class="bi bi-person"></i>
                            Logout
                        </a>
                        <a href="admin_page.html" id="adminPageLink" class="btn btn-outline-success ms-2" style="display: none;">Admin Page</a>
                    </form>
                </div>
            </div>
        </nav>
    `;
    document.getElementById('navbar-container').innerHTML = navbarHTML; // Inject the navbar into the placeholder

    // Add event listener to the logout button
    document.getElementById('logoutButton').addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        logout();
    });
}


function updateNavbar() {
    fetch('/session-check') // Create an endpoint to check session
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Session not found');
            }
        })
        .then(data => {
            if (data.loggedIn) {
                // User is logged in
                document.getElementById('loginButton').style.display = 'none';
                document.getElementById('personalPageLink').style.display = 'block';
                document.getElementById('logoutButton').style.display = 'inline'; // Show the logout button
                document.getElementById('cart_button').style.display = 'inline';
                
                // Check if the user is an admin
                if (data.user && data.user.is_admin) {
                    document.getElementById('adminPageLink').style.display = 'inline'; // Show the admin button
                } else {
                    document.getElementById('adminPageLink').style.display = 'none'; // Hide the admin button
                }
            } else {
                // User is not logged in
                document.getElementById('cart_button').style.display = 'none';
                document.getElementById('loginButton').style.display = 'inline';
                document.getElementById('personalPageLink').style.display = 'none';
                document.getElementById('logoutButton').style.display = 'none'; // Hide the logout button
                document.getElementById('adminPageLink').style.display = 'none'; // Hide the admin button
            }
        })        
        .catch(error => {
            console.error('Error checking session:', error);
        });
}

// Logout function
function logout() {
    fetch('/logout', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                // Redirect to landing page after logout
                window.location.href = 'landing_page.html';
            } else {
                console.error('Error logging out');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
}

// Add event listener to the logout and cart buttons
document.addEventListener('DOMContentLoaded', () => {
    createNavbar(); // Create the navbar on page load
    updateNavbar(); // Call updateNavbar to check login status
});

// search bar redirection
function checkEnter(event) {
    if (event.key === 'Enter') {
        handleSearch(); // Call the search function
    }
}
function handleSearch() {
    const query = document.getElementById('searching_box').value;
    // Redirect to the result page with the search query as a parameter
    window.location.href = `../result_page.html?query=${encodeURIComponent(query)}`;
}
