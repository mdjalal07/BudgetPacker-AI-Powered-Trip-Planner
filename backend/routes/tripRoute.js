import express from 'express';
import { createTrip, getTripById, chatWithAssistant } from '../controllers/tripController.js';

const router = express.Router();

// Generate a new trip
router.post('/generate', createTrip);

// Fetch a trip by ID
router.get('/:id', getTripById);

// Chat and modify itinerary
router.post('/:id/chat', chatWithAssistant);

export default router;
