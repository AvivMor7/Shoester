    document.addEventListener("DOMContentLoaded", function () {
        const form = document.querySelector("form");
        const submitButton = document.querySelector("input[type='submit']");

        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent the default form submission

            // Get values from the form
            const fullName = document.getElementById("Name").value.trim();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("Password").value.trim();
            const email = document.getElementById("emailAddress").value.trim();
            const phoneNumber = document.getElementById("phoneNumber").value.trim();

            // Validation
            if (!fullName || !username || !password || !email || !phoneNumber) {
                alert("Please fill in all fields.");
                return;
            }

            // Email validation using regex
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            // Phone number validation (basic check)
            const phonePattern = /^[0-9]{10,15}$/; // Adjust according to your needs
            if (!phonePattern.test(phoneNumber)) {
                alert("Please enter a valid phone number (10-15 digits).");
                return;
            }

            // All validations passed
            alert("Registration successful!");
            // Here you can send the data to the server or handle it as needed
            // For example: sendDataToServer({ fullName, username, password, email, phoneNumber });

            // Optionally, reset the form
            form.reset();
        });
    });

// end of registration code


