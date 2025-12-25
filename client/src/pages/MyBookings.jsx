import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FaCalendarAlt,
  FaMotorcycle,
  FaStore,
  FaMapMarkerAlt,
  FaClock,
  FaSpinner,
  FaBicycle,
  FaChevronRight
} from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings');
      setBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      rescheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <LoadingSpinner size={250} text="Loading..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-6">
        <FaCalendarAlt className="text-4xl text-primary-600" />
        <h1 className="text-3xl font-bold">My Bookings</h1>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">You have no bookings yet.</p>
          <Link
            to="/bikes"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <FaBicycle />
            <span>Browse Bikes</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-3">
                  <FaMotorcycle className="text-2xl text-primary-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold">
                      {booking.bike?.name}
                    </h3>
                    <p className="text-gray-600">
                      {booking.bike?.brand} • {booking.bike?.category}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start space-x-2">
                  <FaStore className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Dealer</p>
                    <p className="font-semibold">{booking.dealer?.name}</p>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <FaMapMarkerAlt className="text-xs" />
                      <span>{booking.dealer?.address?.city}, {booking.dealer?.address?.state}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <FaClock className="text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Booking Date</p>
                    <p className="font-semibold">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Time: {booking.preferredTime}</p>
                  </div>
                </div>
              </div>

              {booking.rescheduledDate && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm font-semibold text-blue-800">Rescheduled to:</p>
                  <p>
                    {new Date(booking.rescheduledDate).toLocaleDateString()} at{' '}
                    {booking.rescheduledTime}
                  </p>
                </div>
              )}

              {booking.dealerResponse && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-semibold">Dealer Response:</p>
                  <p className="text-sm">{booking.dealerResponse}</p>
                </div>
              )}

              {booking.message && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Your Message:</p>
                  <p className="text-sm">{booking.message}</p>
                </div>
              )}

              <Link
                to={`/bikes/${booking.bike?._id}`}
                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-sm font-semibold"
              >
                <span>View Bike Details</span>
                <FaChevronRight />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

