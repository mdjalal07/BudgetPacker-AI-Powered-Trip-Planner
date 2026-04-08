import Trip from '../models/Trip.js';
import { generateItinerary, chatAboutItinerary } from '../services/aiService.js';

// Generate a new trip
// @route   POST api/trips/generate
export const createTrip = async (req, res) => {
  try {
    const { budget, days, startingCity, destinationCity, vibe } = req.body;

    const itinerary = await generateItinerary(budget, days, startingCity, destinationCity, vibe);

    const newTrip = new Trip({
      budget,
      days,
      startingCity,
      destinationCity,
      vibe,
      itinerary: [itinerary]
    });

    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};

// Fetch a trip by ID
// @route   GET api/trips/:id
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Chat and modify itinerary
// @route   POST api/trips/:id/chat
export const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ error: 'Trip not found' });

    if (!trip.itinerary || trip.itinerary.length === 0) {
      return res.status(400).json({ error: 'No itinerary found to modify' });
    }

    const currentItinerary = trip.itinerary[trip.itinerary.length - 1];

    trip.chatHistory.push({ role: 'user', content: message });

    const updatedItinerary = await chatAboutItinerary(currentItinerary, trip.chatHistory, message);

    trip.itinerary.push(updatedItinerary);
    trip.chatHistory.push({ role: 'assistant', content: 'Itinerary updated according to your request!' });

    await trip.save();
    res.json(trip);
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ error: error.message });
  }
};
