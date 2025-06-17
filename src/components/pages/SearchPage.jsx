import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Grid3X3, 
  Map as MapIcon,
  SlidersHorizontal,
  X,
  ChevronDown,
  Wifi,
  Car,
  Waves,
  Coffee,
  Dumbbell
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import GoogleMap from '../ui/GoogleMap';
import LoadingSpinner from '../ui/LoadingSpinner';
import { listingsAPI } from '../../lib/services';
import { formatPrice, formatRating, truncateText, parseSearchParams, buildSearchUrl } from '../../lib/utils';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Search state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    country: searchParams.get('country') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests')) || 1,
    bedrooms: parseInt(searchParams.get('bedrooms')) || 0,
    bathrooms: parseFloat(searchParams.get('bathrooms')) || 0,
    minPrice: parseInt(searchParams.get('minPrice')) || 0,
    maxPrice: parseInt(searchParams.get('maxPrice')) || 1000,
    propertyType: searchParams.get('propertyType') || '',
    roomType: searchParams.get('roomType') || '',
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
    sortBy: searchParams.get('sortBy') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
  });

  // Property type options
  const propertyTypes = [
    { value: '', label: 'Any type' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'loft', label: 'Loft' },
    { value: 'cabin', label: 'Cabin' },
    { value: 'cottage', label: 'Cottage' },
    { value: 'studio', label: 'Studio' },
  ];

  // Room type options
  const roomTypes = [
    { value: '', label: 'Any room' },
    { value: 'entire_place', label: 'Entire place' },
    { value: 'private_room', label: 'Private room' },
    { value: 'shared_room', label: 'Shared room' },
  ];

  // Amenities options
  const amenitiesOptions = [
    { value: 'wifi', label: 'WiFi', icon: <Wifi className="w-4 h-4" /> },
    { value: 'parking', label: 'Parking', icon: <Car className="w-4 h-4" /> },
    { value: 'pool', label: 'Pool', icon: <Waves className="w-4 h-4" /> },
    { value: 'kitchen', label: 'Kitchen', icon: <Coffee className="w-4 h-4" /> },
    { value: 'gym', label: 'Gym', icon: <Dumbbell className="w-4 h-4" /> },
    { value: 'air_conditioning', label: 'Air conditioning' },
    { value: 'heating', label: 'Heating' },
    { value: 'tv', label: 'TV' },
    { value: 'washer', label: 'Washer' },
    { value: 'dryer', label: 'Dryer' },
    { value: 'pets_allowed', label: 'Pet friendly' },
    { value: 'smoking_allowed', label: 'Smoking allowed' },
  ];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest rated' },
    { value: 'popular', label: 'Most popular' },
  ];

  // Build query parameters for API call
  const queryParams = useMemo(() => {
    const params = { ...filters };
    // Remove empty values
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === 0 || (Array.isArray(params[key]) && params[key].length === 0)) {
        delete params[key];
      }
    });
    // Convert amenities array to comma-separated string
    if (params.amenities && params.amenities.length > 0) {
      params.amenities = params.amenities.join(',');
    }
    return params;
  }, [filters]);

  // Fetch listings
  const { data: listingsData, isLoading, error } = useQuery({
    queryKey: ['listings', queryParams],
    queryFn: () => listingsAPI.getListings(queryParams),
    keepPreviousData: true,
  });

  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 0 && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          newSearchParams.set(key, value.join(','));
        } else {
          newSearchParams.set(key, value.toString());
        }
      }
    });
    setSearchParams(newSearchParams, { replace: true });
  }, [filters, setSearchParams]);

  // Handle filter changes
  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const toggleAmenity = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
      page: 1,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      city: '',
      state: '',
      country: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      bedrooms: 0,
      bathrooms: 0,
      minPrice: 0,
      maxPrice: 1000,
      propertyType: '',
      roomType: '',
      amenities: [],
      sortBy: 'newest',
      page: 1,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is automatically triggered by the query
  };

  const handleListingClick = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  const handlePageChange = (newPage) => {
    updateFilter('page', newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const listings = listingsData?.data?.listings || [];
  const pagination = listingsData?.data?.pagination || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search destinations, properties..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="Check-in"
                  value={filters.checkIn}
                  onChange={(e) => updateFilter('checkIn', e.target.value)}
                  className="w-40"
                />
                <Input
                  type="date"
                  placeholder="Check-out"
                  value={filters.checkOut}
                  onChange={(e) => updateFilter('checkOut', e.target.value)}
                  className="w-40"
                />
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    placeholder="Guests"
                    value={filters.guests}
                    onChange={(e) => updateFilter('guests', parseInt(e.target.value) || 1)}
                    className="pl-10 w-24"
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Filters and View Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Filters Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {(filters.amenities.length > 0 || filters.propertyType || filters.roomType || filters.minPrice > 0 || filters.maxPrice < 1000) && (
                      <Badge variant="secondary" className="ml-1">
                        {filters.amenities.length + (filters.propertyType ? 1 : 0) + (filters.roomType ? 1 : 0) + (filters.minPrice > 0 || filters.maxPrice < 1000 ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine your search to find the perfect stay
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    {/* Price Range */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Price Range</h3>
                      <div className="space-y-4">
                        <Slider
                          value={[filters.minPrice, filters.maxPrice]}
                          onValueChange={([min, max]) => {
                            updateFilter('minPrice', min);
                            updateFilter('maxPrice', max);
                          }}
                          max={1000}
                          step={10}
                          className="w-full"
                        />
                        <div className="flex items-center gap-4">
                          <div>
                            <label className="text-sm text-gray-600">Min</label>
                            <Input
                              type="number"
                              value={filters.minPrice}
                              onChange={(e) => updateFilter('minPrice', parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Max</label>
                            <Input
                              type="number"
                              value={filters.maxPrice}
                              onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value) || 1000)}
                              className="w-20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Property Type */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Property Type</h3>
                      <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Room Type */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Room Type</h3>
                      <Select value={filters.roomType} onValueChange={(value) => updateFilter('roomType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Rooms and Bathrooms */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Bedrooms</label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={filters.bedrooms}
                          onChange={(e) => updateFilter('bedrooms', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Bathrooms</label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={filters.bathrooms}
                          onChange={(e) => updateFilter('bathrooms', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {amenitiesOptions.map((amenity) => (
                          <div key={amenity.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={amenity.value}
                              checked={filters.amenities.includes(amenity.value)}
                              onCheckedChange={() => toggleAmenity(amenity.value)}
                            />
                            <label
                              htmlFor={amenity.value}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                            >
                              {amenity.icon}
                              {amenity.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="pt-4 border-t">
                      <Button variant="outline" onClick={clearFilters} className="w-full">
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort */}
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <MapIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {filters.search || filters.city ? `Search results for "${filters.search || filters.city}"` : 'All properties'}
            </h1>
            {pagination.totalListings && (
              <p className="text-gray-600 mt-1">
                {pagination.totalListings} properties found
              </p>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading listings. Please try again.</p>
          </div>
        )}

        {/* Results Grid or Map */}
        {!isLoading && !error && (
          <>
            {listings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear filters and try again
                </Button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {listings.map((listing) => (
                      <Card 
                        key={listing._id}
                        className="property-card cursor-pointer"
                        onClick={() => handleListingClick(listing._id)}
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
                ) : (
                  // Map View
                  <div className="h-[600px] w-full">
                    <GoogleMap
                      center={
                        listings.length > 0 && listings[0].location?.coordinates
                          ? { 
                              lat: listings[0].location.coordinates[1], 
                              lng: listings[0].location.coordinates[0] 
                            }
                          : { lat: 40.7128, lng: -74.0060 } // Default to NYC
                      }
                      zoom={12}
                      markers={listings
                        .filter(listing => listing.location?.coordinates)
                        .map(listing => ({
                          lat: listing.location.coordinates[1],
                          lng: listing.location.coordinates[0],
                          title: listing.title,
                          infoWindow: `
                            <div style="max-width: 200px;">
                              <img src="${listing.images?.[0]?.url || '/placeholder-image.jpg'}" 
                                   alt="${listing.title}" 
                                   style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
                              <h3 style="font-weight: bold; margin-bottom: 4px;">${listing.title}</h3>
                              <p style="color: #666; font-size: 14px; margin-bottom: 4px;">${listing.location.city}, ${listing.location.state}</p>
                              <p style="font-weight: bold; color: #e53e3e;">${formatPrice(listing.pricing.basePrice)}/night</p>
                            </div>
                          `,
                          listingId: listing._id
                        }))
                      }
                      onMarkerClick={(markerData) => {
                        if (markerData.listingId) {
                          handleListingClick(markerData.listingId);
                        }
                      }}
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                )}

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        disabled={!pagination.hasPrevPage}
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <Button
                              key={page}
                              variant={page === pagination.currentPage ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        disabled={!pagination.hasNextPage}
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

