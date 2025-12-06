import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  useEffect(() => {
    let isMounted = true;
    
    const loadEvents = async () => {
      await fetchEvents();
    };
    
    loadEvents();
    
    return () => {
      isMounted = false;
    };
  }, [filters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      
      const res = await api.get('/events', { params });
      
      // Filter active events and remove duplicates by _id (using Set for better performance)
      const activeEvents = res.data.filter(event => event.status === 'active');
      const seenIds = new Set();
      const uniqueEvents = activeEvents.filter(event => {
        const id = event._id?.toString() || event._id;
        if (seenIds.has(id)) {
          return false;
        }
        seenIds.add(id);
        return true;
      });
      
      setEvents(uniqueEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert('Failed to load events. Please check:\n1. Backend is running on port 5000\n2. MongoDB is connected\n3. Events are seeded in database');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="events-page">
      <div className="container">
        <h1>All Events</h1>

        <div className="filters">
          <input
            type="text"
            name="search"
            placeholder="Search events..."
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="category-select"
          >
            <option value="">All Categories</option>
            <option value="concert">Concert</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="sports">Sports</option>
            <option value="theater">Theater</option>
            <option value="other">Other</option>
          </select>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : events.length > 0 ? (
          <div className="grid grid-3">
            {events.map((event) => {
              const eventDate = new Date(event.date);
              const formattedDate = eventDate.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              });
              
              return (
                <div key={event._id} className="event-card">
                  {event.image && (
                    <img src={event.image} alt={event.title} />
                  )}
                  <div className="event-card-content">
                    <div className="event-header">
                      <span className="event-category">{event.category}</span>
                      {event.featured && (
                        <span className="event-featured-badge">Featured</span>
                      )}
                    </div>
                    <h3>{event.title}</h3>
                    
                    <div className="event-info-section">
                      <div className="event-info-item">
                        <span className="event-info-icon">📅</span>
                        <div className="event-info-text">
                          <strong>Date:</strong>
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                      
                      <div className="event-info-item">
                        <span className="event-info-icon">🕐</span>
                        <div className="event-info-text">
                          <strong>Time:</strong>
                          <span>{event.time}</span>
                        </div>
                      </div>
                      
                      <div className="event-info-item">
                        <span className="event-info-icon">📍</span>
                        <div className="event-info-text">
                          <strong>Location:</strong>
                          <span>{event.venue.name}, {event.venue.city}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="event-footer">
                      <div className="event-price-section">
                        <span className="event-price-label">Price</span>
                        <span className="event-price">₹{event.price.toLocaleString()}</span>
                        <span className="event-price-note">per ticket</span>
                      </div>
                      <div className="event-tickets-info">
                        <span className="event-tickets-badge">
                          {event.availableTickets} tickets left
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      to={`/events/${event._id}`}
                      className="btn btn-primary btn-block"
                    >
                      View Details & Book
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-events">No events found</p>
        )}
      </div>
    </div>
  );
};

export default Events;

