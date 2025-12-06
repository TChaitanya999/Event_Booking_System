import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const res = await api.get('/events?featured=true&status=active');
      // Remove duplicates by _id and take first 3
      const uniqueEvents = res.data.filter((event, index, self) => 
        index === self.findIndex(e => e._id === event._id)
      );
      setFeaturedEvents(uniqueEvents.slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <h1>Discover Amazing Events</h1>
          <p>Book tickets for concerts, conferences, workshops, and more</p>
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
        </div>
      </section>

      <section className="featured-events">
        <div className="container">
          <h2>Featured Events</h2>
          {loading ? (
            <div className="spinner"></div>
          ) : featuredEvents.length > 0 ? (
            <div className="grid grid-3">
              {featuredEvents.map((event) => {
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
                        <span className="event-featured-badge">Featured</span>
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
            <p>No featured events available</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

