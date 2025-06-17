import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { listingsAPI } from '../../lib/services';

const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Booking form state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestDetails, setGuestDetails] = useState({
    adults: 1,
    children: 0,
    infants: 0
  });

  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingsAPI.getListing(id),
  });

  // Extract listing from response
  const listing = response?.data?.listing;

  console.log(response, "API response");
  console.log(listing, "listing data");

  const handleReservation = () => {
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    // Validate guest capacity
    const totalGuests = guestDetails.adults + guestDetails.children;
    const maxGuests = listing.capacity?.guests || 8;
    
    if (totalGuests > maxGuests) {
      alert(`This property can accommodate a maximum of ${maxGuests} guests (excluding infants).`);
      return;
    }

    if (guestDetails.adults < 1) {
      alert('At least 1 adult is required for booking.');
      return;
    }
    
    // Navigate to payment page with booking details
    navigate(`/payment/${id}`, {
      state: {
        checkIn,
        checkOut,
        guests: guestDetails
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Listing</h2>
          <p className="text-gray-600">{error?.message || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
          <p className="text-gray-600">The listing you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">{listing.title}</h1>
            <p className="text-gray-600 mt-2">{listing.location?.city}, {listing.location?.state}</p>
          </div>

          {/* Main Image */}
          {listing.images && listing.images.length > 0 && (
            <div className="h-96 bg-gray-200">
              <img 
                src={listing.images[0].url} 
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Details */}
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About this place</h2>
                  <p className="text-gray-700">{listing.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Property Type:</span>
                      <span className="ml-2 font-medium">{listing.propertyType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Room Type:</span>
                      <span className="ml-2 font-medium">{listing.roomType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Guests:</span>
                      <span className="ml-2 font-medium">{listing.capacity?.guests}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="ml-2 font-medium">{listing.capacity?.bedrooms}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="ml-2 font-medium">{listing.capacity?.bathrooms}</span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                {listing.amenities && listing.amenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {listing.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-700 capitalize">{amenity.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Booking */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      ${listing.pricing?.basePrice}
                    </span>
                    <span className="text-gray-600 ml-1">/ night</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-in
                      </label>
                      <input 
                        type="date" 
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Check-out
                      </label>
                      <input 
                        type="date" 
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guests
                      </label>
                      <div className="border border-gray-300 rounded-md p-3 space-y-3">
                        {/* Adults */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">Adults</span>
                            <p className="text-sm text-gray-500">Ages 13 or above</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => setGuestDetails(prev => ({
                                ...prev,
                                adults: Math.max(1, prev.adults - 1)
                              }))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50"
                              disabled={guestDetails.adults <= 1}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{guestDetails.adults}</span>
                            <button
                              type="button"
                              onClick={() => setGuestDetails(prev => ({
                                ...prev,
                                adults: Math.min(listing.capacity?.guests || 8, prev.adults + 1)
                              }))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                              disabled={guestDetails.adults + guestDetails.children >= (listing.capacity?.guests || 8)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">Children</span>
                            <p className="text-sm text-gray-500">Ages 2-12</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => setGuestDetails(prev => ({
                                ...prev,
                                children: Math.max(0, prev.children - 1)
                              }))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50"
                              disabled={guestDetails.children <= 0}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{guestDetails.children}</span>
                            <button
                              type="button"
                              onClick={() => setGuestDetails(prev => ({
                                ...prev,
                                children: prev.children + 1
                              }))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                              disabled={guestDetails.adults + guestDetails.children >= (listing.capacity?.guests || 8)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Infants */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900">Infants</span>
                            <p className="text-sm text-gray-500">Under 2</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              type="button"
                              onClick={() => setGuestDetails(prev => ({
                                ...prev,
                                infants: Math.max(0, prev.infants - 1)
                              }))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50"
                              disabled={guestDetails.infants <= 0}
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{guestDetails.infants}</span>
                            <button
                              type="button"
                              onClick={() => setGuestDetails(prev => ({
                                ...prev,
                                infants: prev.infants + 1
                              }))}
                              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Total guests display */}
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            Total: {guestDetails.adults + guestDetails.children} guest{guestDetails.adults + guestDetails.children !== 1 ? 's' : ''}
                            {guestDetails.infants > 0 && `, ${guestDetails.infants} infant${guestDetails.infants !== 1 ? 's' : ''}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleReservation}
                      className="w-full bg-red-500 text-white py-3 px-4 rounded-md font-semibold hover:bg-red-600 transition duration-200"
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;

