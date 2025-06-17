import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, Wifi, Car, Waves } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import LoadingSpinner from '../ui/LoadingSpinner';
import { listingsAPI } from '../../lib/services';
import { formatPrice, formatRating, truncateText } from '../../lib/utils';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch featured listings
  const { data: featuredListings, isLoading } = useQuery({
    queryKey: ['featured-listings'],
    queryFn: () => listingsAPI.getListings({ featured: true, limit: 8 }),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleQuickSearch = (location) => {
    navigate(`/search?city=${encodeURIComponent(location)}`);
  };

  const popularDestinations = [
    { name: 'New York', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop' },
    { name: 'San Francisco', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
    { name: 'Miami', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
    { name: 'Austin', image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=400&h=300&fit=crop' },
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: 'Easy Search',
      description: 'Find the perfect place with our advanced search filters and map view.'
    },
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: 'Verified Reviews',
      description: 'Read authentic reviews from real guests to make informed decisions.'
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary" />,
      title: 'Prime Locations',
      description: 'Stay in the heart of your destination with our curated selection.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section min-h-[70vh] flex items-center justify-center text-white relative">
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Find Your Perfect Stay
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Discover unique accommodations around the world
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="glass-effect rounded-full p-2 max-w-2xl mx-auto">
              <div className="flex items-center space-x-2">
                <div className="flex-1 flex items-center space-x-2 px-4">
                  <Search className="w-5 h-5 text-gray-600" />
                  <Input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent text-gray-900 placeholder-gray-600 focus:ring-0"
                  />
                </div>
                <Button type="submit" className="rounded-full px-8 py-3 stayfinder-gradient text-white font-semibold">
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore trending destinations loved by travelers worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <Card 
                key={destination.name}
                className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                onClick={() => handleQuickSearch(destination.name)}
              >
                <div className="relative h-48">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-white font-semibold text-lg">{destination.name}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Stays
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked accommodations that offer exceptional experiences
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings?.data?.listings?.slice(0, 8).map((listing) => (
                <Card 
                  key={listing._id}
                  className="property-card cursor-pointer"
                  onClick={() => navigate(`/listing/${listing._id}`)}
                >
                  <div className="relative h-48">
                    <img
                      src={listing.images?.[0]?.url || '/placeholder-image.jpg'}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    {listing.featured && (
                      <Badge className="absolute top-2 left-2 bg-primary text-white">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {listing.title}
                      </h3>
                      {listing.averageRating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 rating-star fill-current" />
                          <span className="text-sm font-medium">
                            {formatRating(listing.averageRating)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {listing.location.city}, {listing.location.state}
                    </p>
                    <p className="text-gray-500 text-sm mb-3">
                      {truncateText(listing.description, 80)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        {listing.capacity.guests} guests • {listing.capacity.bedrooms} bedrooms
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(listing.pricing.basePrice)}
                        </span>
                        <span className="text-sm text-gray-600"> / night</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/search')}
              className="px-8"
            >
              View All Properties
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose StayFinder?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make it easy to find and book your perfect accommodation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 stayfinder-gradient text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join millions of travelers who trust StayFinder for their accommodations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/search')}
              className="px-8"
            >
              Start Exploring
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/register')}
              className="px-8 border-white text-white hover:bg-white hover:text-primary"
            >
              Become a Host
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

