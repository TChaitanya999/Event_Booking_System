const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-checkout-session
// @desc    Create Stripe checkout session
// @access  Private
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    const booking = await Booking.findById(bookingId).populate('event');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || 
        process.env.STRIPE_SECRET_KEY === 'sk_test_your_stripe_secret_key' ||
        process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key') ||
        process.env.STRIPE_SECRET_KEY.length < 20) {
      return res.status(200).json({ 
        configured: false,
        message: 'Stripe not configured. Use test mode.' 
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: booking.event.title,
              description: `${booking.tickets} ticket(s)`,
            },
            unit_amount: Math.round(booking.totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/events/${booking.event._id}`,
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    booking.stripeSessionId = session.id;
    await booking.save();

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ 
      message: error.message || 'Error creating checkout session',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   POST /api/payments/test-payment
// @desc    Test payment (for development when Stripe is not configured)
// @access  Private
router.post('/test-payment', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    const booking = await Booking.findById(bookingId).populate('event');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    // Mark as completed for testing
    booking.paymentStatus = 'completed';
    booking.paymentIntentId = 'test_payment_' + Date.now();
    await booking.save();

    // Update event available tickets
    const event = await Event.findById(booking.event._id);
    event.availableTickets -= booking.tickets;
    await event.save();

    res.json({ 
      message: 'Test payment completed successfully',
      booking 
    });
  } catch (error) {
    console.error('Test payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Note: Webhook route is handled in server.js to ensure raw body parsing

// @route   GET /api/payments/verify/:sessionId
// @desc    Verify payment status
// @access  Private
router.get('/verify/:sessionId', auth, async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    
    // Handle test payments
    if (sessionId.startsWith('test_')) {
      // Extract booking ID from test session
      const bookingId = sessionId.replace('test_', '');
      const booking = await Booking.findById(bookingId)
        .populate('event');
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      return res.json({ 
        paymentStatus: booking.paymentStatus,
        booking 
      });
    }
    
    // Handle Stripe session
    let booking = await Booking.findOne({ 
      stripeSessionId: sessionId,
      user: req.user._id
    }).populate('event');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If payment is still pending, verify with Stripe directly
    if (booking.paymentStatus === 'pending') {
      try {
        // Check if Stripe is configured
        if (process.env.STRIPE_SECRET_KEY && 
            process.env.STRIPE_SECRET_KEY !== 'sk_test_your_stripe_secret_key' &&
            !process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key') &&
            process.env.STRIPE_SECRET_KEY.length >= 20) {
          
          // Retrieve session from Stripe
          const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
          
          if (stripeSession.payment_status === 'paid') {
            // Payment was successful, update booking
            booking.paymentStatus = 'completed';
            booking.paymentIntentId = stripeSession.payment_intent || stripeSession.id;
            booking.stripeTransactionId = stripeSession.id;
            booking.paymentDate = new Date();
            await booking.save();

            // Update event available tickets if not already updated
            if (booking.event) {
              const eventDoc = await Event.findById(booking.event._id);
              if (eventDoc) {
                // Only decrement if this is the first time marking as completed
                const originalTickets = eventDoc.availableTickets + booking.tickets;
                if (originalTickets === eventDoc.availableTickets + booking.tickets) {
                  eventDoc.availableTickets -= booking.tickets;
                  await eventDoc.save();
                }
              }
            }
            
            console.log('Payment verified and booking updated:', booking._id);
          } else if (stripeSession.payment_status === 'unpaid') {
            // Payment failed or was cancelled
            booking.paymentStatus = 'failed';
            await booking.save();
          }
        }
      } catch (stripeError) {
        console.error('Error verifying with Stripe:', stripeError.message);
        // Continue with current booking status if Stripe verification fails
      }
    }

    // Refresh booking from database
    booking = await Booking.findById(booking._id).populate('event');

    res.json({ 
      paymentStatus: booking.paymentStatus,
      booking 
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/sync/:bookingId
// @desc    Manually sync payment status from Stripe
// @access  Private
router.post('/sync/:bookingId', auth, async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate('event');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!booking.stripeSessionId) {
      return res.status(400).json({ message: 'No Stripe session ID found for this booking' });
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || 
        process.env.STRIPE_SECRET_KEY === 'sk_test_your_stripe_secret_key' ||
        process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key') ||
        process.env.STRIPE_SECRET_KEY.length < 20) {
      return res.status(400).json({ message: 'Stripe is not configured' });
    }

    // Retrieve session from Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(booking.stripeSessionId);
    
    if (stripeSession.payment_status === 'paid' && booking.paymentStatus !== 'completed') {
      // Payment was successful, update booking
      booking.paymentStatus = 'completed';
      booking.paymentIntentId = stripeSession.payment_intent || stripeSession.id;
      booking.stripeTransactionId = stripeSession.id;
      booking.paymentDate = new Date();
      await booking.save();

      // Update event available tickets
      if (booking.event) {
        const eventDoc = await Event.findById(booking.event._id);
        if (eventDoc) {
          eventDoc.availableTickets -= booking.tickets;
          await eventDoc.save();
        }
      }

      return res.json({ 
        message: 'Payment status synced successfully',
        paymentStatus: booking.paymentStatus,
        booking 
      });
    } else if (stripeSession.payment_status === 'unpaid') {
      booking.paymentStatus = 'failed';
      await booking.save();
      return res.json({ 
        message: 'Payment status updated to failed',
        paymentStatus: booking.paymentStatus,
        booking 
      });
    } else {
      return res.json({ 
        message: 'Payment status is already up to date',
        paymentStatus: booking.paymentStatus,
        booking 
      });
    }
  } catch (error) {
    console.error('Payment sync error:', error);
    res.status(500).json({ 
      message: error.message || 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;

