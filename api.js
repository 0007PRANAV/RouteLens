function calculateCost(distance, mode, carType = 'sedan') {
    const rates = {
        driving: { sedan: 0.12, suv: 0.15, hybrid: 0.08, electric: 0.05 },
        transit: 2.50,
        cycling: 1.00,
        walking: 0.00
    };

    switch(mode) {
        case 'driving':
            return (distance * rates.driving[carType]).toFixed(2);
        case 'transit':
            return '2.50';
        case 'cycling':
            return '1.00';
        case 'walking':
            return '0.00';
        default:
            return '0.00';
    }
}

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

function formatDistance(meters) {
    if(meters < 1000) return Math.round(meters) + ' m';
    return (meters / 1000).toFixed(1) + ' km';
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if(hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}