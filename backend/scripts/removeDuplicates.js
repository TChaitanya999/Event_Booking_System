const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');

dotenv.config();

async function removeDuplicates() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventbooking';
    console.log(`Connecting to: ${MONGO_URI}`);
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected!\n');

    // Find all events
    const allEvents = await Event.find({});
    console.log(`📊 Total events in database: ${allEvents.length}`);

    // Group by title and date to find duplicates
    const eventMap = new Map();
    const duplicates = [];

    allEvents.forEach(event => {
      const key = `${event.title}_${event.date}_${event.venue.name}`;
      if (eventMap.has(key)) {
        duplicates.push(event._id);
      } else {
        eventMap.set(key, event._id);
      }
    });

    console.log(`\n🔍 Found ${duplicates.length} duplicate events`);

    if (duplicates.length > 0) {
      // Delete duplicates
      const result = await Event.deleteMany({ _id: { $in: duplicates } });
      console.log(`✅ Removed ${result.deletedCount} duplicate events`);
    } else {
      console.log('✅ No duplicates found!');
    }

    // Final count
    const finalCount = await Event.countDocuments();
    console.log(`\n📊 Final event count: ${finalCount}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

removeDuplicates();

