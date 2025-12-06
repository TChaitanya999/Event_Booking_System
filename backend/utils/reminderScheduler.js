const cron = require('node-cron');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { sendEventReminder } = require('./emailService');

// Run daily at 9 AM to check for events happening in 24 hours
cron.schedule('0 9 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    // Find events happening tomorrow
    const upcomingEvents = await Event.find({
      date: {
        $gte: tomorrow,
        $lt: dayAfter
      },
      status: 'active'
    });

    for (const event of upcomingEvents) {
      // Find all bookings for this event that haven't received reminders
      const bookings = await Booking.find({
        event: event._id,
        paymentStatus: 'completed',
        reminderSent: false
      }).populate('user');

      for (const booking of bookings) {
        await sendEventReminder(booking);
      }
    }

    console.log('Reminder check completed');
  } catch (error) {
    console.error('Error in reminder scheduler:', error);
  }
});

console.log('Reminder scheduler initialized');

