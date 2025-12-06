import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(1);
  const [booking, setBooking] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      toast.error('Event not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    if (!user) {
      toast.info('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (tickets > event.availableTickets) {
      toast.error(`Only ${event.availableTickets} tickets available`);
      return;
    }

    try {
      setProcessing(true);
      console.log('Creating booking...', { eventId: event._id, tickets });
      
      // Create booking
      const bookingRes = await api.post('/bookings', {
        eventId: event._id,
        tickets
      });

      console.log('Booking created:', bookingRes.data);
      setBooking(bookingRes.data);

      // Redirect to payment page
      toast.success('Booking created! Redirecting to payment...');
      navigate(`/payment/${bookingRes.data._id}`);
    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Error creating booking';
      toast.error(errorMessage);
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!event) {
    return null;
  }

  return (
    <div className="event-detail">
      <div className="container">
        <div className="event-detail-content">
          <div className="event-detail-main">
            {event.image && (
              <img src={event.image} alt={event.title} className="event-image" />
            )}
            <h1>{event.title}</h1>
            <p className="event-category">{event.category}</p>
            <div className="event-info">
              <div className="info-item">
                <strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="info-item">
                <strong>🕐 Time:</strong> {event.time}
              </div>
              <div className="info-item">
                <strong>📍 Venue:</strong> {event.venue.name}
              </div>
              <div className="info-item">
                <strong>📍 Address:</strong> {event.venue.address}, {event.venue.city}
              </div>
              <div className="info-item">
                <strong>👤 Organizer:</strong> {event.organizer}
              </div>
            </div>
            <div className="event-description">
              <h2>About This Event</h2>
              <p>{event.description}</p>
            </div>
          </div>

          <div className="event-booking">
            <div className="booking-card">
              <h2>Book Tickets</h2>
              <div className="price">₹{event.price.toLocaleString()} <span>per ticket</span></div>
              <div className="tickets-available">
                {event.availableTickets} tickets available
              </div>
              <div className="form-group">
                <label>Number of Tickets</label>
                <input
                  type="number"
                  min="1"
                  max={event.availableTickets}
                  value={tickets}
                  onChange={(e) => setTickets(parseInt(e.target.value) || 1)}
                  disabled={event.status !== 'active' || processing}
                />
              </div>
              <div className="total-price">
                Total: <strong>₹{(event.price * tickets).toLocaleString()}</strong>
              </div>
              <button
                onClick={handleBookNow}
                disabled={event.status !== 'active' || processing || tickets < 1}
                className="btn btn-primary btn-block"
              >
                {processing ? 'Processing...' : 'Book Now'}
              </button>
              {event.status !== 'active' && (
                <p className="status-message">
                  {event.status === 'sold-out' ? 'Sold Out' : 'Event Cancelled'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

