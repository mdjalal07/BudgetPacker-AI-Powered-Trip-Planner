import User from '../models/User.js';
import Trip from '../models/Trip.js';

// Save a trip to user's profile
// @route   POST api/users/save-trip
export const saveTrip = async (req, res) => {
  try {
    const { tripId } = req.body;
    
    // Check if trip exists
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const user = await User.findById(req.user.id);
    
    // Avoid duplicates
    if (user.savedTrips.includes(tripId)) {
      return res.status(400).json({ message: 'Trip already saved' });
    }

    user.savedTrips.push(tripId);
    await user.save();

    res.json({ message: 'Trip saved successfully', savedTrips: user.savedTrips });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

// Get user's saved trips
// @route   GET api/users/saved-trips
export const getSavedTrips = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedTrips');
    res.json(user.savedTrips);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
