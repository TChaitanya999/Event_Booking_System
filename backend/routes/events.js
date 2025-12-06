const express = require('express');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, featured, status } = req.query;
    const query = {};

    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    if (status) query.status = status;

    let events = await Event.find(query).sort({ date: 1 });

    // Search filter
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      events = events.filter(event => 
        event.title.match(searchRegex) || 
        event.description.match(searchRegex) ||
        event.venue.name.match(searchRegex)
      );
    }

    // Remove duplicates by _id (in case of database duplicates)
    const uniqueEvents = events.filter((event, index, self) => 
      index === self.findIndex(e => e._id.toString() === event._id.toString())
    );

    res.json(uniqueEvents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

