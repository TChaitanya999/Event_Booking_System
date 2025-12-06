import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'concert',
    date: '',
    time: '',
    venue: {
      name: '',
      address: '',
      city: ''
    },
    price: '',
    totalTickets: '',
    organizer: '',
    image: '',
    featured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes, statsRes] = await Promise.all([
        api.get('/events'),
        api.get('/admin/bookings'),
        api.get('/admin/stats')
      ]);
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('venue.')) {
      const venueField = name.split('.')[1];
      setFormData({
        ...formData,
        venue: {
          ...formData.venue,
          [venueField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent._id}`, formData);
        toast.success('Event updated successfully');
      } else {
        await api.post('/admin/events', formData);
        toast.success('Event created successfully');
      }
      setShowEventForm(false);
      setEditingEvent(null);
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time,
      venue: event.venue,
      price: event.price,
      totalTickets: event.totalTickets,
      organizer: event.organizer,
      image: event.image || '',
      featured: event.featured || false
    });
    setShowEventForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/admin/events/${id}`);
        toast.success('Event deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Error deleting event');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'concert',
      date: '',
      time: '',
      venue: { name: '', address: '', city: '' },
      price: '',
      totalTickets: '',
      organizer: '',
      image: '',
      featured: false
    });
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Dashboard</h1>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Events</h3>
              <p className="stat-number">{stats.totalEvents}</p>
            </div>
            <div className="stat-card">
              <h3>Total Bookings</h3>
              <p className="stat-number">{stats.totalBookings}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Bookings</h3>
              <p className="stat-number">{stats.completedBookings}</p>
            </div>
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="admin-actions">
          <button
            onClick={() => {
              setShowEventForm(true);
              setEditingEvent(null);
              resetForm();
            }}
            className="btn btn-primary"
          >
            Create New Event
          </button>
        </div>

        {showEventForm && (
          <div className="event-form-modal">
            <div className="event-form-content">
              <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="concert">Concert</option>
                      <option value="conference">Conference</option>
                      <option value="workshop">Workshop</option>
                      <option value="sports">Sports</option>
                      <option value="theater">Theater</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Venue Name</label>
                  <input
                    type="text"
                    name="venue.name"
                    value={formData.venue.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Venue Address</label>
                    <input
                      type="text"
                      name="venue.address"
                      value={formData.venue.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="venue.city"
                      value={formData.venue.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Total Tickets</label>
                    <input
                      type="number"
                      name="totalTickets"
                      value={formData.totalTickets}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Organizer</label>
                    <input
                      type="text"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                    />
                    Featured Event
                  </label>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventForm(false);
                      setEditingEvent(null);
                      resetForm();
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="admin-sections">
          <section className="events-section">
            <h2>Events</h2>
            <div className="events-table">
              {events.map((event) => (
                <div key={event._id} className="event-row">
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <p>{event.category} • {new Date(event.date).toLocaleDateString()}</p>
                    <p>Tickets: {event.availableTickets}/{event.totalTickets}</p>
                  </div>
                  <div className="event-actions">
                    <button
                      onClick={() => handleEdit(event)}
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bookings-section">
            <h2>Recent Bookings</h2>
            <div className="bookings-table">
              {bookings.slice(0, 10).map((booking) => (
                <div key={booking._id} className="booking-row">
                  <div>
                    <strong>{booking.event.title}</strong>
                    <p>{booking.user.name} ({booking.user.email})</p>
                    <p>{booking.tickets} tickets • ${booking.totalAmount.toFixed(2)}</p>
                  </div>
                  <span className={`badge ${booking.paymentStatus === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

