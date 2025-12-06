const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Event = require('../models/Event');

dotenv.config();

const events = [
  // 1. Concerts & Music Events
  {
    title: 'AR Rahman Live Concert',
    description: 'Experience the magic of AR Rahman live in concert! Join us for an unforgettable evening of music featuring hits from Slumdog Millionaire, Roja, Bombay, and many more iconic soundtracks.',
    category: 'concert',
    date: new Date('2026-04-15'),
    time: '19:00',
    venue: {
      name: 'Jawaharlal Nehru Stadium',
      address: 'Bahadur Shah Zafar Marg',
      city: 'New Delhi'
    },
    price: 2500,
    totalTickets: 50000,
    availableTickets: 50000,
    organizer: 'Live Events India',
    featured: true,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'
  },
  {
    title: 'Sunburn Music Festival',
    description: 'India\'s biggest electronic dance music festival! Three days of non-stop music featuring top international and Indian DJs. Get ready to dance!',
    category: 'concert',
    date: new Date('2026-05-20'),
    time: '16:00',
    venue: {
      name: 'Vagator Beach',
      address: 'Vagator Beach Road',
      city: 'Goa'
    },
    price: 3500,
    totalTickets: 30000,
    availableTickets: 30000,
    organizer: 'Sunburn Festival',
    featured: true,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'
  },
  {
    title: 'Arijit Singh India Tour',
    description: 'The voice of India, Arijit Singh, brings his soulful melodies to your city. An evening of romantic and heart-touching songs.',
    category: 'concert',
    date: new Date('2026-04-25'),
    time: '19:30',
    venue: {
      name: 'Indira Gandhi Indoor Stadium',
      address: 'Pragati Vihar',
      city: 'New Delhi'
    },
    price: 2000,
    totalTickets: 15000,
    availableTickets: 15000,
    organizer: 'Music Tour India',
    featured: true,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
  },
  {
    title: 'Local Band Night',
    description: 'Support local talent! An evening featuring the best local bands from the city. Rock, pop, indie - something for everyone!',
    category: 'concert',
    date: new Date('2026-04-10'),
    time: '20:00',
    venue: {
      name: 'Hard Rock Cafe',
      address: 'DLF Cyber Hub',
      city: 'Gurgaon'
    },
    price: 500,
    totalTickets: 200,
    availableTickets: 200,
    organizer: 'Local Music Collective',
    featured: false,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800'
  },
  {
    title: 'DJ Night – Club XYZ',
    description: 'Weekend party with top DJs spinning the latest hits. Dance the night away with great music and vibes!',
    category: 'concert',
    date: new Date('2026-04-12'),
    time: '22:00',
    venue: {
      name: 'Club XYZ',
      address: 'Connaught Place',
      city: 'New Delhi'
    },
    price: 800,
    totalTickets: 300,
    availableTickets: 300,
    organizer: 'Club XYZ',
    featured: false,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
  },

  // 2. Comedy Shows
  {
    title: 'Zakir Khan – Live',
    description: 'India\'s favorite comedian Zakir Khan brings his hilarious storytelling and relatable humor. Don\'t miss this laughter-filled evening!',
    category: 'other',
    date: new Date('2026-04-18'),
    time: '20:00',
    venue: {
      name: 'Siri Fort Auditorium',
      address: 'August Kranti Marg',
      city: 'New Delhi'
    },
    price: 1500,
    totalTickets: 2000,
    availableTickets: 2000,
    organizer: 'Comedy Live India',
    featured: true,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800'
  },
  {
    title: 'Kenny Sebastian Comedy Night',
    description: 'An evening of clean, intelligent comedy with Kenny Sebastian. Perfect for a fun night out with friends and family.',
    category: 'other',
    date: new Date('2026-04-22'),
    time: '19:30',
    venue: {
      name: 'Kamani Auditorium',
      address: 'Copernicus Marg',
      city: 'New Delhi'
    },
    price: 1200,
    totalTickets: 1500,
    availableTickets: 1500,
    organizer: 'Comedy Nights',
    featured: false,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800'
  },
  {
    title: 'Stand-up Open Mic',
    description: 'Watch emerging comedians showcase their talent! Support local comedy scene and discover new voices.',
    category: 'other',
    date: new Date('2026-04-08'),
    time: '19:00',
    venue: {
      name: 'The Comedy Store',
      address: 'Sector 29',
      city: 'Gurgaon'
    },
    price: 300,
    totalTickets: 100,
    availableTickets: 100,
    organizer: 'Open Mic Nights',
    featured: false,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800'
  },
  {
    title: 'Comedy Jam Weekend',
    description: 'Weekend special comedy show featuring multiple comedians. Guaranteed laughs and great entertainment!',
    category: 'other',
    date: new Date('2026-04-13'),
    time: '20:30',
    venue: {
      name: 'Comedy Central',
      address: 'Greater Kailash',
      city: 'New Delhi'
    },
    price: 600,
    totalTickets: 250,
    availableTickets: 250,
    organizer: 'Weekend Comedy',
    featured: false,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800'
  },

  // 3. Sports Events
  {
    title: 'IPL Match Tickets',
    description: 'Watch your favorite IPL team live in action! Experience the thrill of cricket with thousands of fans.',
    category: 'sports',
    date: new Date('2026-04-20'),
    time: '19:30',
    venue: {
      name: 'Feroz Shah Kotla Stadium',
      address: 'Bahadur Shah Zafar Marg',
      city: 'New Delhi'
    },
    price: 1500,
    totalTickets: 40000,
    availableTickets: 40000,
    organizer: 'BCCI',
    featured: true,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800'
  },
  {
    title: 'ISL Football Match',
    description: 'Indian Super League match - watch top football clubs compete for glory. Cheer for your team!',
    category: 'sports',
    date: new Date('2026-04-16'),
    time: '19:00',
    venue: {
      name: 'Jawaharlal Nehru Stadium',
      address: 'Bahadur Shah Zafar Marg',
      city: 'New Delhi'
    },
    price: 800,
    totalTickets: 25000,
    availableTickets: 25000,
    organizer: 'ISL',
    featured: false,
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800'
  },
  {
    title: 'Marathon / Half Marathon',
    description: 'Join thousands of runners in this city marathon. Choose between full marathon (42km) or half marathon (21km).',
    category: 'sports',
    date: new Date('2026-05-05'),
    time: '06:00',
    venue: {
      name: 'India Gate',
      address: 'Rajpath',
      city: 'New Delhi'
    },
    price: 1000,
    totalTickets: 10000,
    availableTickets: 10000,
    organizer: 'Delhi Marathon Association',
    featured: false,
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800'
  },
  {
    title: 'Badminton Tournament',
    description: 'Local badminton championship featuring top players. Watch exciting matches and support local talent.',
    category: 'sports',
    date: new Date('2026-04-14'),
    time: '10:00',
    venue: {
      name: 'Siri Fort Sports Complex',
      address: 'August Kranti Marg',
      city: 'New Delhi'
    },
    price: 200,
    totalTickets: 500,
    availableTickets: 500,
    organizer: 'Delhi Badminton Association',
    featured: false,
    image: 'https://images.unsplash.com/photo-1622163642999-6c258a8c8a92?w=800'
  },
  {
    title: 'Local Cricket League',
    description: 'Support your local cricket team! Watch exciting matches in the neighborhood cricket league.',
    category: 'sports',
    date: new Date('2026-04-11'),
    time: '16:00',
    venue: {
      name: 'Local Cricket Ground',
      address: 'Sector 15',
      city: 'Noida'
    },
    price: 100,
    totalTickets: 200,
    availableTickets: 200,
    organizer: 'Local Sports Club',
    featured: false,
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800'
  },

  // 4. Workshops & Learning Events
  {
    title: 'Digital Marketing Workshop',
    description: 'Learn digital marketing strategies, SEO, social media marketing, and Google Ads. Perfect for entrepreneurs and marketers.',
    category: 'workshop',
    date: new Date('2026-04-17'),
    time: '10:00',
    venue: {
      name: 'Business Center',
      address: 'Connaught Place',
      city: 'New Delhi'
    },
    price: 2000,
    totalTickets: 50,
    availableTickets: 50,
    organizer: 'Digital Marketing Academy',
    featured: false,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
  },
  {
    title: 'Photography Masterclass',
    description: 'Master the art of photography! Learn composition, lighting, editing, and professional techniques from expert photographers.',
    category: 'workshop',
    date: new Date('2026-04-19'),
    time: '14:00',
    venue: {
      name: 'Art Gallery',
      address: 'Hauz Khas',
      city: 'New Delhi'
    },
    price: 2500,
    totalTickets: 30,
    availableTickets: 30,
    organizer: 'Photography Institute',
    featured: false,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244b32a?w=800'
  },
  {
    title: 'Coding Bootcamp',
    description: 'Intensive coding bootcamp covering web development, JavaScript, React, Node.js. Perfect for career changers and beginners.',
    category: 'workshop',
    date: new Date('2026-04-21'),
    time: '09:00',
    venue: {
      name: 'Tech Hub',
      address: 'DLF Cyber City',
      city: 'Gurgaon'
    },
    price: 5000,
    totalTickets: 40,
    availableTickets: 40,
    organizer: 'Code Academy',
    featured: true,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'
  },
  {
    title: 'Yoga & Meditation Workshop',
    description: 'Rejuvenate your mind and body. Learn yoga asanas, breathing techniques, and meditation practices.',
    category: 'workshop',
    date: new Date('2026-04-15'),
    time: '07:00',
    venue: {
      name: 'Yoga Studio',
      address: 'Lodi Colony',
      city: 'New Delhi'
    },
    price: 800,
    totalTickets: 25,
    availableTickets: 25,
    organizer: 'Yoga Wellness Center',
    featured: false,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800'
  },
  {
    title: 'Art/Craft Workshop',
    description: 'Unleash your creativity! Learn painting, pottery, and various craft techniques. All materials provided.',
    category: 'workshop',
    date: new Date('2026-04-16'),
    time: '15:00',
    venue: {
      name: 'Art Studio',
      address: 'Saket',
      city: 'New Delhi'
    },
    price: 1200,
    totalTickets: 20,
    availableTickets: 20,
    organizer: 'Creative Arts Center',
    featured: false,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800'
  },

  // 5. Festivals & Cultural Events
  {
    title: 'Food & Music Festival',
    description: 'A delightful combination of delicious food from various cuisines and live music performances. Foodies and music lovers unite!',
    category: 'other',
    date: new Date('2026-04-27'),
    time: '12:00',
    venue: {
      name: 'Exhibition Grounds',
      address: 'Pragati Maidan',
      city: 'New Delhi'
    },
    price: 500,
    totalTickets: 5000,
    availableTickets: 5000,
    organizer: 'Food Festivals India',
    featured: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
  },
  {
    title: 'Holi Bash',
    description: 'Celebrate the festival of colors! Join us for a vibrant Holi celebration with colors, music, and traditional food.',
    category: 'other',
    date: new Date('2026-03-25'),
    time: '10:00',
    venue: {
      name: 'Community Park',
      address: 'Sector 18',
      city: 'Noida'
    },
    price: 300,
    totalTickets: 1000,
    availableTickets: 1000,
    organizer: 'Cultural Events Group',
    featured: false,
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800'
  },
  {
    title: 'Garba Night (Navratri)',
    description: 'Traditional Garba night during Navratri. Dance to the beats of dandiya and garba music. Traditional attire welcome!',
    category: 'other',
    date: new Date('2026-10-12'),
    time: '19:00',
    venue: {
      name: 'Community Hall',
      address: 'Greater Kailash',
      city: 'New Delhi'
    },
    price: 400,
    totalTickets: 800,
    availableTickets: 800,
    organizer: 'Gujarati Samaj',
    featured: false,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
  },
  {
    title: 'Movie Screening + Q&A',
    description: 'Special screening of an independent film followed by Q&A session with the director and cast.',
    category: 'other',
    date: new Date('2026-04-23'),
    time: '18:00',
    venue: {
      name: 'Film Institute',
      address: 'Lodhi Road',
      city: 'New Delhi'
    },
    price: 300,
    totalTickets: 150,
    availableTickets: 150,
    organizer: 'Film Society',
    featured: false,
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800'
  },
  {
    title: 'Art & Handicraft Exhibition',
    description: 'Explore beautiful artworks and handicrafts from local and national artists. Perfect for art enthusiasts and collectors.',
    category: 'other',
    date: new Date('2026-04-24'),
    time: '11:00',
    venue: {
      name: 'National Gallery of Modern Art',
      address: 'Jaipur House',
      city: 'New Delhi'
    },
    price: 200,
    totalTickets: 500,
    availableTickets: 500,
    organizer: 'Art Council',
    featured: false,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800'
  },

  // 6. Corporate / Professional Events
  {
    title: 'Tech Startup Conference',
    description: 'Connect with entrepreneurs, investors, and tech enthusiasts. Keynotes, panel discussions, and networking opportunities.',
    category: 'conference',
    date: new Date('2026-05-10'),
    time: '09:00',
    venue: {
      name: 'Convention Center',
      address: 'Aerocity',
      city: 'New Delhi'
    },
    price: 3000,
    totalTickets: 500,
    availableTickets: 500,
    organizer: 'Startup India',
    featured: true,
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'
  },
  {
    title: 'Business Networking Meetup',
    description: 'Monthly business networking event for professionals. Expand your network and discover new opportunities.',
    category: 'conference',
    date: new Date('2026-04-26'),
    time: '18:00',
    venue: {
      name: 'Business Club',
      address: 'Connaught Place',
      city: 'New Delhi'
    },
    price: 500,
    totalTickets: 100,
    availableTickets: 100,
    organizer: 'Business Network India',
    featured: false,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800'
  },
  {
    title: 'Product Launch Event',
    description: 'Exclusive product launch event with live demonstrations, Q&A, and special offers for early attendees.',
    category: 'conference',
    date: new Date('2026-04-28'),
    time: '19:00',
    venue: {
      name: 'Hotel Grand',
      address: 'Vasant Kunj',
      city: 'New Delhi'
    },
    price: 1000,
    totalTickets: 200,
    availableTickets: 200,
    organizer: 'Tech Corp',
    featured: false,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800'
  },
  {
    title: 'HR Summit',
    description: 'Annual HR Summit featuring discussions on talent management, workplace culture, and HR technology trends.',
    category: 'conference',
    date: new Date('2026-05-08'),
    time: '09:30',
    venue: {
      name: 'Leela Palace',
      address: 'Chanakyapuri',
      city: 'New Delhi'
    },
    price: 2500,
    totalTickets: 300,
    availableTickets: 300,
    organizer: 'HR Association',
    featured: false,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800'
  },
  {
    title: 'Leadership Training Program',
    description: 'Intensive leadership development program covering communication, team management, and strategic thinking.',
    category: 'workshop',
    date: new Date('2026-04-29'),
    time: '10:00',
    venue: {
      name: 'Training Center',
      address: 'Saket',
      city: 'New Delhi'
    },
    price: 4000,
    totalTickets: 40,
    availableTickets: 40,
    organizer: 'Leadership Institute',
    featured: false,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800'
  },

  // 7. Social Events
  {
    title: 'Wedding Event',
    description: 'Elegant wedding venue booking. Perfect for intimate ceremonies and grand celebrations. Full catering and decoration services available.',
    category: 'other',
    date: new Date('2026-05-15'),
    time: '18:00',
    venue: {
      name: 'Grand Wedding Hall',
      address: 'DLF Phase 4',
      city: 'Gurgaon'
    },
    price: 50000,
    totalTickets: 500,
    availableTickets: 500,
    organizer: 'Wedding Planners',
    featured: false,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'
  },
  {
    title: 'Birthday Party',
    description: 'Celebrate your special day! Party hall booking with decoration, music, and catering options.',
    category: 'other',
    date: new Date('2026-04-30'),
    time: '19:00',
    venue: {
      name: 'Party Hall',
      address: 'Sector 15',
      city: 'Noida'
    },
    price: 5000,
    totalTickets: 50,
    availableTickets: 50,
    organizer: 'Event Planners',
    featured: false,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'
  },
  {
    title: 'Engagement Party',
    description: 'Beautiful engagement party venue with elegant decoration and catering services.',
    category: 'other',
    date: new Date('2026-05-12'),
    time: '19:30',
    venue: {
      name: 'Garden Venue',
      address: 'Lodi Garden',
      city: 'New Delhi'
    },
    price: 30000,
    totalTickets: 200,
    availableTickets: 200,
    organizer: 'Celebration Events',
    featured: false,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'
  },
  {
    title: 'Baby Shower',
    description: 'Celebrate the upcoming arrival! Beautifully decorated venue perfect for baby shower celebrations.',
    category: 'other',
    date: new Date('2026-05-05'),
    time: '16:00',
    venue: {
      name: 'Event Space',
      address: 'Greater Kailash',
      city: 'New Delhi'
    },
    price: 8000,
    totalTickets: 40,
    availableTickets: 40,
    organizer: 'Baby Shower Specialists',
    featured: false,
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800'
  },
  {
    title: 'Corporate Annual Day',
    description: 'Corporate annual day celebration venue with stage, sound system, and catering facilities.',
    category: 'other',
    date: new Date('2026-05-20'),
    time: '18:00',
    venue: {
      name: 'Convention Hall',
      address: 'Aerocity',
      city: 'New Delhi'
    },
    price: 100000,
    totalTickets: 1000,
    availableTickets: 1000,
    organizer: 'Corporate Events',
    featured: false,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'
  },

  // 8. Online / Virtual Events
  {
    title: 'Live Webinar on AI',
    description: 'Join our expert-led webinar on Artificial Intelligence, Machine Learning, and their applications in business.',
    category: 'conference',
    date: new Date('2026-04-20'),
    time: '15:00',
    venue: {
      name: 'Online Event',
      address: 'Virtual',
      city: 'Online'
    },
    price: 500,
    totalTickets: 1000,
    availableTickets: 1000,
    organizer: 'Tech Education Hub',
    featured: false,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800'
  },
  {
    title: 'Virtual Fitness Session',
    description: 'Join live virtual fitness sessions from home! HIIT, yoga, and strength training sessions with certified trainers.',
    category: 'workshop',
    date: new Date('2026-04-18'),
    time: '07:00',
    venue: {
      name: 'Online Event',
      address: 'Virtual',
      city: 'Online'
    },
    price: 300,
    totalTickets: 500,
    availableTickets: 500,
    organizer: 'Fitness Online',
    featured: false,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800'
  },
  {
    title: 'Online Music Show',
    description: 'Enjoy a live online music concert from the comfort of your home! Featuring popular artists and bands.',
    category: 'concert',
    date: new Date('2026-04-19'),
    time: '20:00',
    venue: {
      name: 'Online Event',
      address: 'Virtual',
      city: 'Online'
    },
    price: 400,
    totalTickets: 2000,
    availableTickets: 2000,
    organizer: 'Virtual Concerts',
    featured: false,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'
  },
  {
    title: 'Virtual Coding Hackathon',
    description: '48-hour virtual hackathon! Build innovative solutions, compete with developers worldwide, and win exciting prizes.',
    category: 'workshop',
    date: new Date('2026-05-01'),
    time: '10:00',
    venue: {
      name: 'Online Event',
      address: 'Virtual',
      city: 'Online'
    },
    price: 1000,
    totalTickets: 200,
    availableTickets: 200,
    organizer: 'Hackathon India',
    featured: true,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'
  },
  {
    title: 'Online Interview Prep Session',
    description: 'Master your interview skills! Live session covering resume building, interview techniques, and mock interviews.',
    category: 'workshop',
    date: new Date('2026-04-17'),
    time: '16:00',
    venue: {
      name: 'Online Event',
      address: 'Virtual',
      city: 'Online'
    },
    price: 600,
    totalTickets: 100,
    availableTickets: 100,
    organizer: 'Career Coaching',
    featured: false,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800'
  }
];

async function seedEvents() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventbooking');
    console.log('MongoDB Connected');

    // Remove duplicates first
    console.log('Checking for duplicates...');
    const existingEvents = await Event.find({});
    const eventMap = new Map();
    const duplicatesToDelete = [];

    existingEvents.forEach(event => {
      const key = `${event.title}_${event.date}_${event.venue.name}`;
      if (eventMap.has(key)) {
        duplicatesToDelete.push(event._id);
      } else {
        eventMap.set(key, event._id);
      }
    });

    if (duplicatesToDelete.length > 0) {
      await Event.deleteMany({ _id: { $in: duplicatesToDelete } });
      console.log(`✅ Removed ${duplicatesToDelete.length} duplicate events`);
    }

    // Check which events already exist before inserting
    const eventsToInsert = [];
    for (const event of events) {
      const key = `${event.title}_${event.date}_${event.venue.name}`;
      const exists = await Event.findOne({
        title: event.title,
        date: event.date,
        'venue.name': event.venue.name
      });
      
      if (!exists) {
        eventsToInsert.push(event);
      }
    }

    let insertedEvents = [];
    if (eventsToInsert.length === 0) {
      console.log('✅ All events already exist in database. No new events to add.');
    } else {
      // Insert only new events
      insertedEvents = await Event.insertMany(eventsToInsert);
      console.log(`✅ Successfully seeded ${insertedEvents.length} new events!`);
    }

    // Display summary only if events were inserted
    if (insertedEvents.length > 0) {
      const categories = {};
      insertedEvents.forEach(event => {
        categories[event.category] = (categories[event.category] || 0) + 1;
      });

      console.log('\n📊 Events by Category:');
      Object.keys(categories).forEach(cat => {
        console.log(`  ${cat}: ${categories[cat]} events`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents();

