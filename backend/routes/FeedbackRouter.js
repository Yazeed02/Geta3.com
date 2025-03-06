const express = require('express');
const router = express.Router();
const FeedbackController = require('../controllers/FeedbackController');
const passport = require('passport');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        console.log('Admin access granted:', req.user.email);
        return next();
    }
    console.error('Access denied. Admin privileges required.');
    return res.status(403).json({ message: 'Not authorized. Admin access required.' });
};

// Routes
router.post('/submit', passport.authenticate('jwt', { session: false }), FeedbackController.createFeedback);
router.get('/all', passport.authenticate('jwt', { session: false }), isAdmin, FeedbackController.getAllFeedbacks);

module.exports = router;