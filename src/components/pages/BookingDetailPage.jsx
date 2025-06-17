import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Users, Clock, CreditCard, Phone, Mail, Star, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice, formatDate, formatDateRange, calculateNights } from '../../lib/utils';
import LoadingSpinner from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Fetch booking details from API
  const { data: booking, isLoading, isError } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch booking details');
      }
      
      const data = await response.json();
      return data.data.booking;
    }
  });

  
  const handleCancelBooking = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'cancelled',
          reason: 'Cancelled by guest'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }
      
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
      navigate('/bookings');
    } catch {
      toast.error('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => navigate('/bookings')}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
              <p className="text-gray-600">Booking #{booking._id}</p>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span className="capitalize">{booking.status}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Booked on {formatDate(booking.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{booking.totalGuests}{booking.totalGuests > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{nights} night{nights > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Property Details</h2>
              
              <div className="flex gap-4">
                {booking.listing.images && booking.listing.images.length > 0 && (
                  <img
                    src={booking.listing.images[0].url}
                    alt={booking.listing.images[0].alt}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {booking.listing.title}
                  </h3>
                  
                  <div className="flex items-start gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <div>
                      <p>{booking.listing.location.address}</p>
                      <p>{booking.listing.location.city}, {booking.listing.location.state} {booking.listing.location.zipCode}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/listing/${booking.listing._id}`)}
                    className="text-red-500 hover:text-red-600 font-medium text-sm"
                  >
                    View Property →
                  </button>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stay Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Check-in</h3>
                  <p className="text-gray-600">{formatDate(booking.checkIn)}</p>
                  <p className="text-sm text-gray-500">After 3:00 PM</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Check-out</h3>
                  <p className="text-gray-600">{formatDate(booking.checkOut)}</p>
                  <p className="text-sm text-gray-500">Before 11:00 AM</p>
                </div>
              </div>
            </div>

            {/* Host Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Host Information</h2>
              
              <div className="flex items-center gap-4">
                <img
                  src={booking.listing.host.avatar}
                  alt={booking.listing.host.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{booking.listing.host.firstName +" "+ booking.listing.host.lastName}</h3>
                  <div className="flex items-center gap-1 text-yellow-400 mb-2">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-gray-600 text-sm ml-1"> {booking.listing.host.averageRating} ({booking.listing.host.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{booking.listing.host.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{booking.listing.host.email}</span>
                </div>
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Guest Information</h2>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">Primary Guest</h3>
                  <p className="text-gray-600">{booking.guest.firstName+ " " + booking.guest.lastName}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{booking.guest.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{booking.guest.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Breakdown</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{formatPrice(booking.pricing.basePrice)} x {nights} nights</span>
                  <span className="font-medium">{formatPrice(booking.pricing.totalBasePrice)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Cleaning fee</span>
                  <span className="font-medium">{formatPrice(booking.pricing.cleaningFee)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium">{formatPrice(booking.pricing.serviceFee)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span className="font-medium">{formatPrice(booking.pricing.taxes)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">{formatPrice(booking.pricing.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600">{booking.payment.method} ending in {booking.payment.cardDetails.last4}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className="font-medium text-green-600 capitalize">{booking.payment.status}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {booking.status === 'confirmed' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
                
                <div className="space-y-3">
                  <button
                    onClick={() => window.print()}
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
                  >
                    Print Booking Details
                  </button>
                  
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Booking</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone and cancellation fees may apply.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailPage;

