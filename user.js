const express = require('express');
const router = express.Router();

// Mock user profiles
const profiles = {};

// Get profile
router.get('/profile', (req, res) => {
    const userId = req.headers['user-id'] || 'default';
    
    if(!profiles[userId]) {
        return res.json({
            homeAddress: '',
            workAddress: '',
            carType: 'sedan',
            budget: 50
        });
    }

    res.json(profiles[userId]);
});

// Save profile
router.post('/profile', (req, res) => {
    const userId = req.headers['user-id'] || 'default';
    const profile = req.body;

    profiles[userId] = profile;

    res.json({ success: true, profile: profile });
});

// Get analytics
router.get('/analytics', (req, res) => {
    res.json({
        totalDistance: 156.5,
        totalCost: 234.50,
        totalEmissions: 32.8,
        favoriteRoute: 'driving',
        commutes: 28
    });
});

// Save to history
router.post('/history', (req, res) => {
    const routeData = req.body;
    
    res.json({
        success: true,
        message: 'Route saved to history',
        data: routeData
    });
});

module.exports = router;