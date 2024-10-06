const RAPIDAPI_KEY = '6a2a422068msh9a52666f613826bp1281cejsn0f9ccb9c5db1'; // Your RapidAPI key
const GOOGLE_MAPS_API_KEY = 'AIzaSyCQgGRI1UX2C-vD-jMXmHR2auVAAhbLZpk'; // Your Google Maps API key

// Google Maps initialization function
function initMap(lat, lng) {
    const location = { lat: 31.969892, lng: 34.772147 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: location,
    });
    new google.maps.Marker({
        position: location,
        map: map,
    });
}

// Fetch location data
fetch('https://google-map-places.p.rapidapi.com/maps/api/geocode/json?address=1600%20Amphitheatre%2BParkway%2C%20Mountain%20View%2C%20CA&language=en&region=en&result_type=administrative_area_level_1&location_type=APPROXIMATE', {
    method: 'GET',
    headers: {
        'x-rapidapi-host': 'google-map-places.p.rapidapi.com',
        'x-rapidapi-key': '6a2a422068msh9a52666f613826bp1281cejsn0f9ccb9c5db1' // Use your RapidAPI key here
    }
})
.then(response => response.json())
.then(data => {
    const lat = data.results[0].geometry.location.lat;
    const lng = data.results[0].geometry.location.lng;
    initMap(lat, lng); // Call initMap with coordinates
})
.catch(err => console.error(err));


 // 31.969892, 34.772147
 // AIzaSyCQgGRI1UX2C-vD-jMXmHR2auVAAhbLZpk