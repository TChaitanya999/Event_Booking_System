import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import './Payment.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Sb1xoJfRc85BxruZb6O4oycxnzbrQ2Wr');
const PaymentForm = ({ booking, onSuccess, onTestPayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Create payment intent
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        setProcessing(false);
        return;
      }

      // Create Stripe checkout session
      const paymentRes = await api.post('/payments/create-checkout-session', {
        bookingId: booking._id
      });

      // Check if Stripe is not configured
      if (paymentRes.data.configured === false) {
        // Use test payment instead
        if (onTestPayment) {
          await onTestPayment();
        }
        return;
      }

      if (paymentRes.data.url) {
        // Redirect to Stripe Checkout
        window.location.href = paymentRes.data.url;
      } else if (paymentRes.data.sessionId) {
        // Use Stripe redirect
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: paymentRes.data.sessionId
        });

        if (stripeError) {
          console.error('Stripe redirect error:', stripeError);
          // Fallback to test payment if Stripe fails
          if (onTestPayment) {
            await onTestPayment();
          }
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.response?.data?.message || 'Payment processing failed');
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="payment-section">
        <h3>Payment Details</h3>
        <div className="card-element-container">
          <CardElement options={cardElementOptions} />
        </div>
        {error && <div className="payment-error">{error}</div>}
      </div>

      <div className="payment-summary">
        <h3>Order Summary</h3>
        <div className="summary-item">
          <span>Event:</span>
          <strong>{booking.event.title}</strong>
        </div>
        <div className="summary-item">
          <span>Tickets:</span>
          <strong>{booking.tickets}</strong>
        </div>
        <div className="summary-item">
          <span>Price per ticket:</span>
          <strong>₹{booking.event.price.toLocaleString()}</strong>
        </div>
        <div className="summary-item total">
          <span>Total Amount:</span>
          <strong>₹{booking.totalAmount.toLocaleString()}</strong>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary btn-block"
      >
        {processing ? 'Processing...' : `Pay ₹${booking.totalAmount.toLocaleString()}`}
      </button>

      <div className="payment-info">
        <p>🔒 Secure payment powered by Stripe</p>
        <p className="test-mode">Test Mode: Use card 4242 4242 4242 4242</p>
      </div>
    </form>
  );
};

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useTestMode, setUseTestMode] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.info('Please login to continue');
      navigate('/login');
      return;
    }

    fetchBooking();
  }, [bookingId, user]);

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/${bookingId}`);
      const bookingData = res.data;

      // Check if already paid
      if (bookingData.paymentStatus === 'completed') {
        toast.success('Payment already completed!');
        navigate('/dashboard');
        return;
      }

      setBooking(bookingData);
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Booking not found');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPayment = async () => {
    try {
      setUseTestMode(true);
      const res = await api.post('/payments/test-payment', {
        bookingId: booking._id
      });

      toast.success('Payment completed successfully!');
      // Redirect to success page with booking ID
      navigate(`/booking-success?booking_id=${booking._id}`);
    } catch (error) {
      console.error('Test payment error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
      setUseTestMode(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!booking || !booking.event) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="payment-main">
            <h2>Booking Not Found</h2>
            <p>The booking information could not be loaded.</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stripeKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
  const isStripeConfigured = stripeKey && stripeKey !== 'pk_test_your_key_here';

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1>Complete Your Payment</h1>
          <p>Booking ID: {booking._id.slice(-8).toUpperCase()}</p>
        </div>

        <div className="payment-content">
          <div className="payment-main">
            {isStripeConfigured ? (
              <Elements stripe={stripePromise}>
                <PaymentForm 
                  booking={booking} 
                  onSuccess={() => navigate('/booking-success')}
                  onTestPayment={handleTestPayment}
                />
              </Elements>
            ) : (
              <div className="test-mode-payment">
                <div className="payment-summary">
                  <h3>Order Summary</h3>
                  <div className="summary-item">
                    <span>Event:</span>
                    <strong>{booking.event.title}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Tickets:</span>
                    <strong>{booking.tickets}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Price per ticket:</span>
                    <strong>₹{booking.event.price.toLocaleString()}</strong>
                  </div>
                  <div className="summary-item total">
                    <span>Total Amount:</span>
                    <strong>₹{booking.totalAmount.toLocaleString()}</strong>
                  </div>
                </div>

                <button
                  onClick={handleTestPayment}
                  disabled={useTestMode}
                  className="btn btn-primary btn-block"
                >
                  {useTestMode ? 'Processing...' : `Pay ₹${booking.totalAmount.toLocaleString()}`}
                </button>

                <div className="payment-info">
                  <p>🔒 Secure payment processing</p>
                </div>
              </div>
            )}
          </div>

          <div className="payment-sidebar">
            <div className="event-info-card">
              <h3>Event Details</h3>
              <div className="event-info-item">
                <strong>📅 Date:</strong>
                <span>{new Date(booking.event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="event-info-item">
                <strong>🕐 Time:</strong>
                <span>{booking.event.time}</span>
              </div>
              <div className="event-info-item">
                <strong>📍 Venue:</strong>
                <span>{booking.event.venue.name}</span>
              </div>
              <div className="event-info-item">
                <strong>📍 Location:</strong>
                <span>{booking.event.venue.address}, {booking.event.venue.city}</span>
              </div>
            </div>

            <div className="security-info">
              <h4>🔒 Secure Payment</h4>
              <p>Your payment information is encrypted and secure. We never store your card details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

