const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock users database
const users = [
    { id: 1, email: 'user@example.com', password: 'password123' }
];

// Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    const user = users.find(u => u.email === email && u.password === password);

    if(!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '7d'
    });

    res.json({ token: token, user: user });
});

// Register
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    if(users.find(u => u.email === email)) {
        return res.status(409).json({ error: 'User already exists' });
    }

    const newUser = {
        id: users.length + 1,
        email: email,
        password: password
    };

    users.push(newUser);

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '7d'
    });

    res.status(201).json({ token: token, user: newUser });
});

module.exports = router;