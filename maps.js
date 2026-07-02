let map;
let directionsService;
let directionsRenderer;
let autocompleteFrom;
let autocompleteTo;

// Initialize map
function initMap() {
    const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // NYC
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: defaultLocation,
        styles: [
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#e9e9e9" }]
            }
        ]
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Setup autocomplete
    setupAutocomplete();
}

// Setup autocomplete for locations
function setupAutocomplete() {
    const options = {
        componentRestrictions: { country: 'us' },
        fields: ['place_id', 'geometry', 'formatted_address', 'name']
    };

    const fromInput = document.getElementById('fromLocation');
    const toInput = document.getElementById('toLocation');

    autocompleteFrom = new google.maps.places.Autocomplete(fromInput, options);
    autocompleteTo = new google.maps.places.Autocomplete(toInput, options);

    // Listen for place changes
    autocompleteFrom.addListener('place_changed', () => {
        const place = autocompleteFrom.getPlace();
        if(place.geometry) {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
        }
    });

    autocompleteTo.addListener('place_changed', () => {
        const place = autocompleteTo.getPlace();
        if(place.geometry) {
            map.setCenter(place.geometry.location);
            map.setZoom(15);
        }
    });
}

// Display route on map
function displayRoute(from, to, mode) {
    const modeMap = {
        'driving': google.maps.TravelMode.DRIVING,
        'transit': google.maps.TravelMode.TRANSIT,
        'walking': google.maps.TravelMode.WALKING,
        'cycling': google.maps.TravelMode.BICYCLING
    };

    const request = {
        origin: from,
        destination: to,
        travelMode: modeMap[mode] || google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result, status) => {
        if(status === 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            console.error('Directions error:', status);
        }
    });
}

// Geocode address to coordinates
function geocodeAddress(address) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if(status === 'OK') {
                resolve(results[0].geometry.location);
            } else {
                reject(new Error('Geocoding error: ' + status));
            }
        });
    });
}

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('map')) {
        initMap();
    }
});