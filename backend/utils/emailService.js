const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEventReminder = async (booking) => {
  try {
    // Ensure user is populated
    if (!booking.user || !booking.user.email) {
      const User = require('../models/User');
      booking.user = await User.findById(booking.user);
    }

    if (!booking.user || !booking.user.email) {
      console.error('User not found for booking:', booking._id);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.user.email,
      subject: `Reminder: ${booking.event.title} is coming up!`,
      html: `
        <h2>Event Reminder</h2>
        <p>Hello ${booking.user.name},</p>
        <p>This is a reminder that you have tickets for:</p>
        <h3>${booking.event.title}</h3>
        <p><strong>Date:</strong> ${new Date(booking.event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${booking.event.time}</p>
        <p><strong>Venue:</strong> ${booking.event.venue.name}, ${booking.event.venue.address}</p>
        <p><strong>Tickets:</strong> ${booking.tickets}</p>
        <p>We look forward to seeing you there!</p>
      `
    };

    await transporter.sendMail(mailOptions);
    booking.reminderSent = true;
    await booking.save();
  } catch (error) {
    console.error('Error sending reminder email:', error);
  }
};

module.exports = { sendEventReminder };

