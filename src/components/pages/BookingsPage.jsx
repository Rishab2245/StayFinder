import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Users, Clock, Star, Filter, Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatPrice, formatDate, formatDateRange, calculateNights } from '../../lib/utils';
import LoadingSpinner from '../ui/LoadingSpinner';

const BookingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Fetch bookings from API
  const { data: bookingsData, isLoading, isError } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await fetch('https://stayfinder-backend-5yvk.onrender.com/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      return data.data.bookings;
    }
  });

  const bookings = bookingsData || [];

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
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings?.filter(booking => {
    // Filter by tab
    if (activeTab !== 'all' && booking.status !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !booking.listing.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !booking.listing.location.city.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  }) || [];

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'checkin':
        return new Date(a.checkIn) - new Date(b.checkIn);
      case 'price':
        return b.pricing.total - a.pricing.total;
      default:
        return 0;
    }
  });

  const tabs = [
    { id: 'all', label: 'All Bookings', count: bookings?.length || 0 },
    { id: 'confirmed', label: 'Confirmed', count: bookings?.filter(b => b.status === 'confirmed').length || 0 },
    { id: 'pending', label: 'Pending', count: bookings?.filter(b => b.status === 'pending').length || 0 },
    { id: 'completed', label: 'Completed', count: bookings?.filter(b => b.status === 'completed').length || 0 },
    { id: 'cancelled', label: 'Cancelled', count: bookings?.filter(b => b.status === 'cancelled').length || 0 }
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Bookings</h2>
          <p className="text-gray-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your reservations and travel plans</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by property name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="checkin">Check-in Date</option>
                  <option value="price">Price (High to Low)</option>
                </select>
                
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {sortedBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || activeTab !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Start planning your next adventure!'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
              Explore Properties
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedBookings.map((booking) => {
              const nights = calculateNights(booking.checkIn, booking.checkOut);
              
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => navigate(`/bookings/${booking._id}`)}
                >
                  
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Property Image */}
                      <div className="lg:w-48 lg:h-32">
                        {booking.listing.images && booking.listing.images.length > 0 && (
                          <img
                            src={booking.listing.images[0].url}
                            alt={booking.listing.images[0].alt}
                            className="w-full h-48 lg:h-32 object-cover rounded-lg"
                          />
                        )}
                      </div>

                      {/* Booking Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {booking.listing.title}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                              <MapPin className="w-4 h-4" />
                              <span>{booking.listing.location.city}, {booking.listing.location.state}</span>
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-gray-600 text-sm">
                                {booking.listing.rating} ({booking.listing.totalReviews} reviews)
                              </span>
                            </div>
                          </div>
                          
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDateRange(booking.checkIn, booking.checkOut)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{booking.guests.adults + booking.guests.children} guest{booking.guests.adults + booking.guests.children > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{nights} night{nights > 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={booking.host.avatar}
                              alt={booking.host.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm text-gray-600">
                              Hosted by {booking.host.firstName} {booking.host.lastName}
                            </span>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              {formatPrice(booking.pricing.totalPrice)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Booking #{booking._id}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;

