import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
  budget: { type: Number, required: true },
  days: { type: Number, required: true },
  startingCity: { type: String, required: true },
  destinationCity: { type: String, required: true },
  vibe: { type: String, required: true },
  itinerary: { type: Array, default: [] },
  chatHistory: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Trip', tripSchema);
