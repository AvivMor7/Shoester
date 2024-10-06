const RAPIDAPI_KEY = '6a2a422068msh9a52666f613826bp1281cejsn0f9ccb9c5db1'; // Your RapidAPI key

// Initialize the map
function initMap() {
    const defaultLocation = [31.969892, 34.772147]; // Latitude and Longitude
    const map = L.map('map').setView(defaultLocation, 10); // Set view to default location

    // Load and display tile layers
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker at the default location
    L.marker(defaultLocation).addTo(map)
        .bindPopup('Default Location')
        .openPopup();

    // Fetch location data (if you still want to do this)
    fetch('https://google-map-places.p.rapidapi.com/maps/api/geocode/json?address=1600%20Amphitheatre%2BParkway%2C%20Mountain%20View%2C%20CA&language=en&region=en&result_type=administrative_area_level_1&location_type=APPROXIMATE', {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
            'x-rapidapi-key': RAPIDAPI_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.results && data.results.length > 0) {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            const location = [lat, lng]; // Array format for Leaflet

            map.setView(location); // Center the map to the fetched location
            L.marker(location).addTo(map) // Add marker at the fetched location
                .bindPopup('Fetched Location')
                .openPopup();
        } else {
            console.error("No results found");
        }
    })
    .catch(err => console.error(err));
}

// Call the initMap function after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initMap);

 // 31.969892, 34.772147
 // AIzaSyCQgGRI1UX2C-vD-jMXmHR2auVAAhbLZpk