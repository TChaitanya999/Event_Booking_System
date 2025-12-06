**Event Booking System – MERN Stack (with Stripe Payments)

Complete README & Workflow Documentation**

1. Project Overview

This project is a full-stack Event Booking System built using the MERN stack, integrating secure Stripe payments.

The system allows users to:

Browse available events

Register/login

Book events

Make secure online payments using Stripe

View booking details

Technologies used:

MongoDB – Database

Express.js – Backend API framework

React.js – Frontend interface

Node.js – Backend runtime environment

Stripe – Payment gateway

2. Folder Structure
EVENT_BOOKING_SYSTEM/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── package.json
│   └── node_modules/
│
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── node_modules/

3. Backend (Node.js + Express.js)
Responsibilities:

Handles all API routes (auth, events, bookings)

Handles real-time Stripe payment processing

Communicates with MongoDB using Mongoose

Manages authentication using JWT

Validates user input and protects private routes

Start Backend:
cd backend
npm install
npm start

Backend .env File (REQUIRED):
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_strong_secure_random_key
PORT=5000

# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret    # only if using webhooks

4. Frontend (React.js)
Responsibilities:

Displays event listings and booking UI

Sends requests to backend API

Integrates Stripe Checkout frontend

Stores authentication tokens

Shows success/error messages

Start Frontend:
cd frontend
npm install
npm start


Frontend runs on:

http://localhost:3000

5. How MERN + Stripe Workflow Works (Event Booking System)
1. User opens the React application

They can:

View upcoming events

Login / Register

Proceed to book an event

2. User selects an event and clicks “Book Now”

React sends a request:

POST /api/bookings/create-checkout-session

3. Express backend receives booking request

Backend:

Verifies user token

Verifies event availability

Creates a Stripe Checkout Session

4. Backend contacts Stripe
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [...],
  mode: "payment",
  success_url: "...",
  cancel_url: "...",
});

5. Stripe returns a secure payment URL

Backend returns the URL to React:

{ "url": "https://checkout.stripe.com/..." }

6. React redirects user to Stripe Checkout

User enters card details and completes payment.

7. Stripe confirms payment

Sends confirmation to backend (webhook or success URL)

Backend creates booking record in MongoDB

8. MongoDB stores booking data

Stored data:

User ID

Event ID

Payment ID

Payment status (“paid”)

Timestamp

9. React updates user dashboard

Shows:

Booking confirmation

Event details

Payment status

6. Connections Between Frontend, Backend & MongoDB
React → Express

Used for:

Login / Register

Getting list of events

Creating checkout session

Storing booking details

Uses:

axios.post("http://localhost:5000/api/auth/login", data);

Express → Stripe

Creates payment sessions

Validates payment

Handles webhook events

Express → MongoDB

Uses Mongoose:

User model

Event model

Booking model

MongoDB → Express → React

Returns event data

Returns booking history

Confirms payment

7. Event Booking Workflow (Start to End)
Step 1: User visits website

React loads events from backend.

Step 2: User logs in / registers

Backend returns JWT.

Step 3: User selects event

Clicks Book Now.

Step 4: Backend creates Stripe session

Stripe generates checkout page.

Step 5: User makes payment

Stripe validates card & processes payment.

Step 6: Payment successful

Backend creates booking entry and marks as "Paid".

Step 7: React shows confirmation message

User sees:
✔ Booking details
✔ Payment status
✔ Event information

8. MongoDB Connection (Compass or Atlas)

In config/db.js or server.js:

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


Atlas connection example:

MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventsDB

9. Scripts
Backend
npm start

Frontend
npm start

10. Conclusion
The Event Booking System is a complete MERN project that provides secure user authentication, event listing and booking features, and seamless Stripe payment integration. It ensures smooth data flow between the frontend, backend, and MongoDB, all built on a clean and scalable architecture. The system is designed for fast performance, secure payments, and a professional workflow, making the overall booking experience reliable and efficient for users.
