import express from 'express';
import { saveTrip, getSavedTrips } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Save a trip to user's profile
router.post('/save-trip', authMiddleware, saveTrip);

// Get user's saved trips
router.get('/saved-trips', authMiddleware, getSavedTrips);

export default router;
