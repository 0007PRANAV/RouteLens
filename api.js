// API Configuration
const API_BASE = 'http://localhost:5000/api';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// Calculate route cost based on distance and mode
function calculateCost(distance, mode, carType = 'sedan') {
    const rates = {
        driving: { sedan: 0.12, suv: 0.15, hybrid: 0.08, electric: 0.05 },
        transit: { bus: 2.5, train: 4 },
        cycling: { bike_share: 1 },
        walking: { free: 0 }
    };

    switch(mode) {
        case 'driving':
            return (distance * rates.driving[carType]).toFixed(2);
        case 'transit':
            return '2.50'; // Average transit fare
        case 'cycling':
            return '1.00';
        case 'walking':
            return '0.00';
        default:
            return '0.00';
    }
}

// Calculate CO2 emissions
function calculateEmissions(distance, mode, carType = 'sedan') {
    const emissions = {
        driving: { sedan: 0.21, suv: 0.28, hybrid: 0.10, electric: 0 },
        transit: 0.05,
        cycling: 0,
        walking: 0
    };

    switch(mode) {
        case 'driving':
            return (distance * emissions.driving[carType]).toFixed(2);
        case 'transit':
            return (distance * emissions.transit).toFixed(2);
        case 'cycling':
        case 'walking':
            return '0.00';
        default:
            return '0.00';
    }
}

// Format distance
function formatDistance(meters) {
    if(meters < 1000) return meters + ' m';
    return (meters / 1000).toFixed(1) + ' km';
}

// Format duration
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if(hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}

// Fetch routes from backend
async function fetchRoutes(from, to, date, time, modes) {
    try {
        const response = await fetch(`${API_BASE}/routes/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                origin: from,
                destination: to,
                date: date,
                time: time,
                modes: modes
            })
        });

        if(!response.ok) {
            throw new Error('Failed to fetch routes');
        }

        return await response.json();
    } catch(error) {
        console.error('API Error:', error);
        showNotification('Failed to fetch routes', 'error');
        return null;
    }
}

// Get user profile
async function getUserProfile() {
    try {
        const response = await fetch(`${API_BASE}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if(!response.ok) {
            throw new Error('Failed to fetch profile');
        }

        return await response.json();
    } catch(error) {
        console.error('Error:', error);
        return null;
    }
}

// Save user profile
async function saveUserProfile(profile) {
    try {
        const response = await fetch(`${API_BASE}/user/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(profile)
        });

        if(!response.ok) {
            throw new Error('Failed to save profile');
        }

        return await response.json();
    } catch(error) {
        console.error('Error:', error);
        showNotification('Failed to save profile', 'error');
        return null;
    }
}

// Get user analytics
async function getUserAnalytics() {
    try {
        const response = await fetch(`${API_BASE}/user/analytics`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if(!response.ok) {
            throw new Error('Failed to fetch analytics');
        }

        return await response.json();
    } catch(error) {
        console.error('Error:', error);
        return null;
    }
}

// Save route to user history
async function saveRoute(routeData) {
    try {
        const response = await fetch(`${API_BASE}/user/history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(routeData)
        });

        if(!response.ok) {
            throw new Error('Failed to save route');
        }

        return await response.json();
    } catch(error) {
        console.error('Error:', error);
        return null;
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}