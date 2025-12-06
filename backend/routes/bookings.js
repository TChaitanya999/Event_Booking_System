const express = require('express');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get user bookings
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'event',
        options: { strictPopulate: false } // Allow null if event is deleted
      })
      .sort({ bookingDate: -1 });
    
    // Filter out bookings where event is null (event was deleted)
    const validBookings = bookings.filter(booking => booking.event !== null);
    
    res.json(validBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'event',
      options: { strictPopulate: false }
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if event exists
    if (!booking.event) {
      return res.status(404).json({ message: 'Event associated with this booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Create booking
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { eventId, tickets } = req.body;

    console.log('Creating booking request:', { eventId, tickets, userId: req.user._id });

    if (!eventId || !tickets || tickets < 1) {
      return res.status(400).json({ message: 'Invalid booking data' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      console.error('Event not found:', eventId);
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'active') {
      return res.status(400).json({ message: 'Event is not available for booking' });
    }

    if (event.availableTickets < tickets) {
      return res.status(400).json({ 
        message: `Only ${event.availableTickets} tickets available` 
      });
    }

    const totalAmount = event.price * tickets;

    const booking = new Booking({
      user: req.user._id,
      event: eventId,
      tickets,
      totalAmount,
      paymentStatus: 'pending'
    });

    await booking.save();
    console.log('Booking created successfully:', booking._id);

    // Populate event details
    await booking.populate('event');

    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message || 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;

