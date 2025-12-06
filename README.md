# **Event Booking System – MERN Stack**

## **Complete README & Workflow Documentation**

---

## **1. Project Overview**

This project is a full-stack ** Event Booking System ** built using the ** MERN stack ** .

### **The system allows users to:**

* Browse available events
* Register / Login
* Book events
* View booking details

### **Technologies Used:**

* **MongoDB** – Database
* **Express.js** – Backend API framework
* **React.js** – Frontend interface
* **Node.js** – Backend runtime environment

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
npm run dev
```

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

## **5. How MERN (Event Booking System)**

### **1. User opens the React application**

Users can:

* View events
* Login/Register
* Start booking an event

### **3. Express backend receives booking request**

Backend:

* Verifies user authentication
* Checks event availability
* Creates a Stripe Checkout Session


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

### **MongoDB → Express → React**

* Returns event lists
* Returns booking details
* Sends payment status

---

## **7. Event Booking Workflow (Start to End)**

### **Step 1:** User opens the website → React loads events

### **Step 2:** User logs in / registers → Backend returns JWT

### **Step 3:** User selects an event → Clicks **Book Now**

### **Step 4:** Backend saves booking & marks as **Paid**

### **Step 5:** React shows confirmation:
---

## **8. Scripts**

### **Backend**

```bash
npm start
```

### **Frontend**

```bash
npm start
```

---

## **9. Screenshots**
<img width="1500" height="800" alt="Screenshot 2025-12-06 215800" src="https://github.com/user-attachments/assets/dc0fb65d-af9b-492d-b382-d46b58685799" />

<img width="1500" height="800" alt="Screenshot 2025-12-06 215817" src="https://github.com/user-attachments/assets/49aab2ef-bb09-46cf-9966-155664f167fd" />

<img width="1500" height="800" alt="Screenshot 2025-12-06 215558" src="https://github.com/user-attachments/assets/22563554-c042-44f1-a5d2-7774d8763a17" />

<img width="1500" height="800" alt="Screenshot 2025-12-06 215630" src="https://github.com/user-attachments/assets/bb9e2b4c-e886-40be-80f9-2d16d0c675a3" />


## **10. Conclusion**

The Event Booking System is a complete MERN project that provides secure user authentication, event listing and booking features, and seamless Stripe payment integration. It ensures smooth data flow between the frontend, backend, and MongoDB, all built on a clean and scalable architecture. The system is designed for fast performance, secure payments, and a professional workflow, making the overall booking experience reliable and efficient for users.
