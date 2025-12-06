const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');

dotenv.config();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...\n');
    
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventbooking';
    console.log(`Connecting to: ${MONGO_URI}`);
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected!\n');
    
    // Check events count
    const eventCount = await Event.countDocuments();
    console.log(`📊 Total events in database: ${eventCount}`);
    
    if (eventCount === 0) {
      console.log('\n⚠️  No events found in database!');
      console.log('💡 Run: npm run seed (to add sample events)\n');
    } else {
      // Show sample events
      const sampleEvents = await Event.find({}).limit(5);
      console.log('\n📅 Sample events:');
      sampleEvents.forEach((event, index) => {
        console.log(`   ${index + 1}. ${event.title} (${event.category}) - Status: ${event.status}`);
      });
      
      // Count by status
      const activeCount = await Event.countDocuments({ status: 'active' });
      const soldOutCount = await Event.countDocuments({ status: 'sold-out' });
      const cancelledCount = await Event.countDocuments({ status: 'cancelled' });
      
      console.log('\n📈 Events by status:');
      console.log(`   Active: ${activeCount}`);
      console.log(`   Sold-out: ${soldOutCount}`);
      console.log(`   Cancelled: ${cancelledCount}`);
      
      // Count by category
      const categories = await Event.distinct('category');
      console.log('\n📂 Categories:');
      for (const cat of categories) {
        const count = await Event.countDocuments({ category: cat });
        console.log(`   ${cat}: ${count} events`);
      }
    }
    
    // Test API endpoint
    console.log('\n🌐 Test API endpoint:');
    console.log('   GET http://localhost:5000/api/events');
    console.log('   Should return events array\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Make sure MongoDB is running');
    console.error('   2. Check MONGO_URI in .env file');
    console.error('   3. Verify MongoDB connection string');
    process.exit(1);
  }
}

checkDatabase();

