import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      // Filter out any bookings with null events (safety check)
      const validBookings = res.data.filter(booking => booking.event !== null && booking.event !== undefined);
      setBookings(validBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-danger',
      refunded: 'badge-info'
    };
    return badges[status] || 'badge-info';
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>My Bookings</h1>
        <p className="welcome">Welcome, {user?.name}!</p>

        {bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings
              .filter(booking => booking.event) // Filter out bookings with null events
              .map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.event?.title || 'Event Not Found'}</h3>
                    <span className={`badge ${getStatusBadge(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </div>
                  <div className="booking-details">
                    <p><strong>📅 Date:</strong> {booking.event?.date ? new Date(booking.event.date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : 'N/A'}</p>
                    <p><strong>🕐 Time:</strong> {booking.event?.time || 'N/A'}</p>
                    <p><strong>📍 Venue:</strong> {booking.event?.venue ? `${booking.event.venue.name}, ${booking.event.venue.city}` : 'N/A'}</p>
                    <p><strong>🎫 Tickets:</strong> {booking.tickets}</p>
                    <p><strong>💰 Total Amount:</strong> ₹{booking.totalAmount.toLocaleString()}</p>
                    <p><strong>📅 Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="no-bookings">You have no bookings yet. <a href="/events">Browse events</a></p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

