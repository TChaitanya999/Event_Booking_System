# ** Event Booking System – MERN Stack **

## **Complete README & Workflow Documentation**

---

## **1. Project Overview**

This project is a full-stack **Event Booking System** built using the **MERN stack**, integrated with **secure Stripe payments**.

### **The system allows users to:**

* Browse available events
* Register / Login
* Book events
* Make secure online payments using Stripe
* View booking details

### **Technologies Used:**

* **MongoDB** – Database
* **Express.js** – Backend API framework
* **React.js** – Frontend interface
* **Node.js** – Backend runtime environment
* **Stripe** – Payment gateway

---

## **2. Folder Structure**

```
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
```

---

## **3. Backend (Node.js + Express.js)**

### **Responsibilities**

* Handles all API routes (auth, events, bookings)
* Handles real-time Stripe payment processing
* Communicates with MongoDB using Mongoose
* Manages authentication using JWT
* Validates input and protects private routes

### **Start Backend**

```bash
cd backend
npm install
npm start
```

### **Backend `.env` file (Required)**

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_strong_secure_random_key
PORT=5000

# Stripe Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

---

## **4. Frontend (React.js)**

### **Responsibilities**

* Displays event listings and booking UI
* Sends requests to backend API
* Integrates Stripe Checkout
* Stores authentication tokens
* Displays success/error messages

### **Start Frontend**

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## **5. How MERN + Stripe Workflow Works (Event Booking System)**

### **1. User opens the React application**

Users can:

* View events
* Login/Register
* Start booking an event

### **2. User selects an event and clicks “Book Now”**

React sends a request:

```
POST /api/bookings/create-checkout-session
```

### **3. Express backend receives booking request**

Backend:

* Verifies user authentication
* Checks event availability
* Creates a Stripe Checkout Session

### **4. Backend contacts Stripe**

```js
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [...],
  mode: "payment",
  success_url: "...",
  cancel_url: "...",
});
```

### **5. Stripe returns a secure payment URL**

Backend returns:

```json
{ "url": "https://checkout.stripe.com/..." }
```

### **6. React redirects user to Stripe Checkout**

User enters card details & completes payment.

### **7. Stripe confirms payment**

Stripe sends confirmation to backend via:

* Webhooks, or
* Success URL

Backend then stores booking in MongoDB.

### **8. MongoDB stores booking data**

Stored information:

* User ID
* Event ID
* Payment ID
* Payment status ("Paid")
* Timestamp

### **9. React updates user dashboard**

User sees:

* Booking confirmation
* Event details
* Payment status

---

## **6. Connections Between Frontend, Backend & MongoDB**

### **React → Express**

Used for:

* Login / Register
* Fetching events
* Creating checkout session
* Saving bookings

Example:

```js
axios.post("http://localhost:5000/api/auth/login", data);
```

### **Express → Stripe**

* Creates checkout sessions
* Validates payments
* Handles webhook responses

### **Express → MongoDB**

Using Mongoose for:

* User model
* Event model
* Booking model

### **MongoDB → Express → React**

* Returns event lists
* Returns booking details
* Sends payment status

---

## **7. Event Booking Workflow (Start to End)**

### **Step 1:** User opens the website -> React loads events

### **Step 2:** User logs in / registers -> Backend returns JWT

### **Step 3:** User selects an event -> Clicks **Book Now**

### **Step 4:** Backend creates Stripe Session -> Returns URL

### **Step 5:** User completes payment on Stripe

### **Step 6:** Backend saves booking & marks as **Paid**

### **Step 7:** React shows confirmation:

✔ Booking details
✔ Payment status
✔ Event information

---

## **8. MongoDB Connection (Compass or Atlas)**

Example code in `config/db.js`:

```js
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
```

### **Atlas Example**

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventsDB
```

---

## **9. Scripts**

### **Backend**

```bash
npm start
```

### **Frontend**

```bash
npm start
```

---

## **10. Conclusion**

The Event Booking System is a complete MERN project that provides secure user authentication, event listing and booking features, and seamless Stripe payment integration. It ensures smooth data flow between the frontend, backend, and MongoDB, all built on a clean and scalable architecture. The system is designed for fast performance, secure payments, and a professional workflow, making the overall booking experience reliable and efficient for users.
