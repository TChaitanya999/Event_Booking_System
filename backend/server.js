const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());

// Stripe webhook route - must be before express.json() middleware
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('./models/Booking');
const Event = require('./models/Event');

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  // If webhook secret is not configured, skip verification (for development)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (webhookSecret && webhookSecret !== 'whsec_your_stripe_webhook_secret_here' && !webhookSecret.includes('your_stripe_webhook_secret')) {
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // For development: parse event without verification
    try {
      event = JSON.parse(req.body.toString());
    } catch (err) {
      console.error('Failed to parse webhook event:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  console.log('Received Stripe webhook event:', event.type);

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata?.bookingId;

    if (!bookingId) {
      console.error('No bookingId in session metadata');
      return res.json({ received: true });
    }

    try {
      const booking = await Booking.findById(bookingId).populate('event');
      if (!booking) {
        console.error('Booking not found:', bookingId);
        return res.json({ received: true });
      }

      if (booking.paymentStatus === 'pending') {
        // Retrieve payment intent details from Stripe
        let paymentIntentId = session.payment_intent;
        let amountPaid = session.amount_total;
        let currency = session.currency;

        // If payment_intent is a string ID, retrieve full details
        if (paymentIntentId && typeof paymentIntentId === 'string') {
          try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            amountPaid = paymentIntent.amount;
            currency = paymentIntent.currency;
          } catch (err) {
            console.error('Error retrieving payment intent:', err.message);
          }
        }

        // Update booking
        booking.paymentStatus = 'completed';
        booking.paymentIntentId = paymentIntentId || session.id;
        booking.stripeTransactionId = session.id;
        booking.paymentDate = new Date();
        await booking.save();

        console.log('Booking payment completed:', bookingId);

        // Update event available tickets
        if (booking.event) {
          const eventDoc = await Event.findById(booking.event._id);
          if (eventDoc) {
            eventDoc.availableTickets -= booking.tickets;
            await eventDoc.save();
            console.log('Event tickets updated:', booking.event._id);
          }
        }
      } else {
        console.log('Booking already processed:', bookingId, 'Status:', booking.paymentStatus);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      // Don't return error to Stripe, just log it
    }
  }

  // Handle payment_intent.succeeded as a backup
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    try {
      // Find booking by payment intent ID
      const booking = await Booking.findOne({ 
        paymentIntentId: paymentIntent.id 
      }).populate('event');

      if (!booking) {
        // Try to find by stripeSessionId and update
        const sessionId = paymentIntent.metadata?.session_id;
        if (sessionId) {
          const bookingBySession = await Booking.findOne({ 
            stripeSessionId: sessionId 
          }).populate('event');
          
          if (bookingBySession && bookingBySession.paymentStatus === 'pending') {
            bookingBySession.paymentStatus = 'completed';
            bookingBySession.paymentIntentId = paymentIntent.id;
            bookingBySession.stripeTransactionId = paymentIntent.id;
            bookingBySession.paymentDate = new Date();
            await bookingBySession.save();

            if (bookingBySession.event) {
              const eventDoc = await Event.findById(bookingBySession.event._id);
              if (eventDoc) {
                eventDoc.availableTickets -= bookingBySession.tickets;
                await eventDoc.save();
              }
            }
            console.log('Booking payment completed via payment_intent:', bookingBySession._id);
          }
        }
      } else if (booking.paymentStatus === 'pending') {
        booking.paymentStatus = 'completed';
        booking.stripeTransactionId = paymentIntent.id;
        booking.paymentDate = new Date();
        await booking.save();

        if (booking.event) {
          const eventDoc = await Event.findById(booking.event._id);
          if (eventDoc) {
            eventDoc.availableTickets -= booking.tickets;
            await eventDoc.save();
          }
        }
        console.log('Booking payment completed via payment_intent:', booking._id);
      }
    } catch (error) {
      console.error('Error processing payment_intent webhook:', error);
    }
  }

  res.json({ received: true });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// Initialize reminder scheduler
require('./utils/reminderScheduler');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// MongoDB Connection
const PORT = process.env.PORT || 6004;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventbooking';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

