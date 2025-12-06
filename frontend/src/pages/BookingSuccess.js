import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import './BookingSuccess.css';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (sessionId && sessionId.startsWith('test_')) {
      // Test payment - fetch booking directly
      fetchBookingById();
    } else if (sessionId) {
      verifyPayment();
    } else if (bookingId) {
      // Direct booking ID
      fetchBookingById();
    } else {
      navigate('/dashboard');
    }
  }, [sessionId, bookingId]);

  const fetchBookingById = async () => {
    try {
      const id = bookingId || sessionId?.replace('test_', '');
      if (!id) {
        navigate('/dashboard');
        return;
      }
      
      // Try to get booking by ID first
      const bookingRes = await api.get(`/bookings/${id}`);
      if (bookingRes.data && bookingRes.data.paymentStatus === 'completed') {
        setBooking(bookingRes.data);
        toast.success('Payment successful!');
      } else {
        // If not found or not completed, try verify endpoint
        if (sessionId) {
          await verifyPayment();
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      // Try verify endpoint as fallback
      if (sessionId) {
        await verifyPayment();
      } else {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async () => {
    try {
      const res = await api.get(`/payments/verify/${sessionId}`);
      if (res.data.paymentStatus === 'completed') {
        setBooking(res.data.booking);
        toast.success('Payment successful!');
      } else {
        // Payment still pending, fetch booking directly
        if (res.data.booking?._id) {
          const bookingRes = await api.get(`/bookings/${res.data.booking._id}`);
          setBooking(bookingRes.data);
        }
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      // Don't show error, just try to fetch booking
      if (bookingId) {
        try {
          const bookingRes = await api.get(`/bookings/${bookingId}`);
          setBooking(bookingRes.data);
        } catch (err) {
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!booking || !booking.event) {
    return (
      <div className="booking-success">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">⚠️</div>
            <h1>Booking Not Found</h1>
            <p>The booking information could not be loaded.</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-success">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>Booking Confirmed!</h1>
          <p>Your tickets have been successfully booked.</p>

          <div className="booking-details">
            <h2>{booking.event.title}</h2>
            <div className="detail-item">
              <strong>📅 Date:</strong> {new Date(booking.event.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="detail-item">
              <strong>🕐 Time:</strong> {booking.event.time}
            </div>
            <div className="detail-item">
              <strong>📍 Venue:</strong> {booking.event.venue.name}
            </div>
            <div className="detail-item">
              <strong>📍 Address:</strong> {booking.event.venue.address}, {booking.event.venue.city}
            </div>
            <div className="detail-item">
              <strong>🎫 Number of Tickets:</strong> {booking.tickets}
            </div>
            <div className="detail-item">
              <strong>💰 Total Amount:</strong> ₹{booking.totalAmount.toLocaleString()}
            </div>
          </div>

          <div className="success-actions">
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              View My Bookings
            </button>
            <button onClick={() => navigate('/events')} className="btn btn-secondary">
              Browse More Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;

