const express = require('express');
const router = express.Router();

// Calculate routes
router.post('/calculate', (req, res) => {
    const { origin, destination, date, time, modes } = req.body;

    if(!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination required' });
    }

    // Mock route calculation
    const distance = Math.random() * 20 + 5;
    const duration = Math.floor(distance * 3 + Math.random() * 20);

    const routes = [];

    if(modes.includes('driving')) {
        routes.push({
            id: 'driving',
            mode: 'driving',
            title: 'Driving',
            distance: distance,
            duration: duration,
            cost: (distance * 0.12).toFixed(2),
            emissions: (distance * 0.21).toFixed(2)
        });
    }

    if(modes.includes('transit')) {
        routes.push({
            id: 'transit',
            mode: 'transit',
            title: 'Public Transit',
            distance: distance * 1.1,
            duration: duration + 15,
            cost: '2.50',
            emissions: (distance * 0.05).toFixed(2)
        });
    }

    if(modes.includes('cycling')) {
        routes.push({
            id: 'cycling',
            mode: 'cycling',
            title: 'Cycling',
            distance: distance * 1.2,
            duration: duration * 2,
            cost: '1.00',
            emissions: '0.00'
        });
    }

    if(modes.includes('walking')) {
        routes.push({
            id: 'walking',
            mode: 'walking',
            title: 'Walking',
            distance: distance * 1.3,
            duration: duration * 3,
            cost: '0.00',
            emissions: '0.00'
        });
    }

    res.json({
        origin: origin,
        destination: destination,
        routes: routes,
        timestamp: new Date()
    });
});

module.exports = router;