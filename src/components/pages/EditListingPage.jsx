import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listingsAPI } from '../../lib/services';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Upload, X, Image as ImageIcon, Save, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const EditListingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    roomType: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    capacity: {
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    amenities: [],
    pricing: {
      basePrice: '',
      cleaningFee: '',
      securityDeposit: '',
    },
    images: [],
    imageFiles: [],
    houseRules: '',
    cancellationPolicy: 'moderate',
    availability: {
      instantBook: false,
      advanceNotice: '1_day',
      preparationTime: '1_day',
      availabilityWindow: '12_months',
    },
    status: 'active',
  });

  const propertyTypes = [
    'apartment',
    'house',
    'condo',
    'villa',
    'cabin',
    'loft',
    'studio',
    'townhouse',
  ];

  const roomTypes = [
    'entire_place',
    'private_room',
    'shared_room',
  ];

  const availableAmenities = [
    'wifi',
    'kitchen',
    'washer',
    'dryer',
    'air_conditioning',
    'heating',
    'tv',
    'parking',
    'pool',
    'gym',
    'balcony',
    'garden',
    'fireplace',
    'laptop_friendly',
    'pets_allowed',
    'smoking_allowed',
    'hot_tub',
    'bbq_grill',
    'beach_access',
    'ski_in_out',
  ];

  const cancellationPolicies = [
    { value: 'flexible', label: 'Flexible - Full refund 1 day prior to arrival' },
    { value: 'moderate', label: 'Moderate - Full refund 5 days prior to arrival' },
    { value: 'strict', label: 'Strict - 50% refund up until 1 week prior to arrival' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active - Visible to guests' },
    { value: 'inactive', label: 'Inactive - Hidden from guests' },
    { value: 'draft', label: 'Draft - Not published' },
  ];

  // Load listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setInitialLoading(true);
        const response = await listingsAPI.getListing(id);
        
        if (response.status === 'success') {
          const listingData = response.data.listing;
          setListing(listingData);
          
          // Populate form with existing data
          setFormData({
            title: listingData.title || '',
            description: listingData.description || '',
            propertyType: listingData.propertyType || '',
            roomType: listingData.roomType || '',
            location: {
              address: listingData.location?.address || '',
              city: listingData.location?.city || '',
              state: listingData.location?.state || '',
              country: listingData.location?.country || '',
              zipCode: listingData.location?.zipCode || '',
            },
            capacity: {
              guests: listingData.capacity?.guests || 1,
              bedrooms: listingData.capacity?.bedrooms || 1,
              beds: listingData.capacity?.beds || 1,
              bathrooms: listingData.capacity?.bathrooms || 1,
            },
            amenities: listingData.amenities || [],
            pricing: {
              basePrice: listingData.pricing?.basePrice || '',
              cleaningFee: listingData.pricing?.cleaningFee || '',
              securityDeposit: listingData.pricing?.securityDeposit || '',
            },
            images: listingData.images || [],
            imageFiles: [],
            houseRules: listingData.houseRules || '',
            cancellationPolicy: listingData.cancellationPolicy || 'moderate',
            availability: {
              instantBook: listingData.availability?.instantBook || false,
              advanceNotice: listingData.availability?.advanceNotice || '1_day',
              preparationTime: listingData.availability?.preparationTime || '1_day',
              availabilityWindow: listingData.availability?.availabilityWindow || '12_months',
            },
            status: listingData.status || 'active',
          });
        } else {
          toast.error('Failed to load listing');
          navigate('/host/dashboard');
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast.error('Failed to load listing');
        navigate('/host/dashboard');
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id, navigate]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please upload only JPEG, PNG, or WebP images');
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    // Check total number of images
    if (formData.images.length + files.length > 10) {
      toast.error('You can upload a maximum of 10 images');
      return;
    }

    // Create preview URLs and add files
    const newImageFiles = [...formData.imageFiles, ...files];
    const newImagePreviews = [...formData.images];

    files.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      newImagePreviews.push(previewUrl);
    });

    setFormData(prev => ({
      ...prev,
      images: newImagePreviews,
      imageFiles: newImageFiles,
    }));

    toast.success(`${files.length} image(s) added successfully`);
  };

  const removeImage = (index) => {
    // Check if it's a new uploaded image (has object URL)
    if (formData.images[index].startsWith('blob:')) {
      URL.revokeObjectURL(formData.images[index]);
    }

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.title.trim()) {
        toast.error('Please enter a listing title');
        return;
      }
      if (!formData.description.trim()) {
        toast.error('Please enter a description');
        return;
      }
      if (!formData.propertyType) {
        toast.error('Please select a property type');
        return;
      }
      if (!formData.roomType) {
        toast.error('Please select a room type');
        return;
      }
      if (!formData.location.city.trim()) {
        toast.error('Please enter a city');
        return;
      }
      if (!formData.pricing.basePrice || formData.pricing.basePrice <= 0) {
        toast.error('Please enter a valid base price');
        return;
      }

      // Prepare listing data
      const listingData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        propertyType: formData.propertyType,
        roomType: formData.roomType,
        location: {
          address: formData.location.address.trim(),
          city: formData.location.city.trim(),
          state: formData.location.state.trim(),
          country: formData.location.country.trim(),
          zipCode: formData.location.zipCode.trim(),
        },
        capacity: {
          guests: parseInt(formData.capacity.guests),
          bedrooms: parseInt(formData.capacity.bedrooms),
          beds: parseInt(formData.capacity.beds),
          bathrooms: parseFloat(formData.capacity.bathrooms),
        },
        amenities: formData.amenities,
        pricing: {
          basePrice: parseFloat(formData.pricing.basePrice),
          cleaningFee: formData.pricing.cleaningFee ? parseFloat(formData.pricing.cleaningFee) : 0,
          securityDeposit: formData.pricing.securityDeposit ? parseFloat(formData.pricing.securityDeposit) : 0,
        },
        houseRules: formData.houseRules.trim(),
        cancellationPolicy: formData.cancellationPolicy,
        availability: formData.availability,
        status: formData.status,
        // Keep existing images for now (image upload needs backend support)
        images: formData.images.filter(img => !img.startsWith('blob:')), // Remove blob URLs
      };

      const response = await listingsAPI.updateListing(id, listingData);
      
      if (response.status === 'success') {
        toast.success('Listing updated successfully!');
        navigate('/host/dashboard');
      } else {
        toast.error(response.message || 'Failed to update listing');
      }
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error(error.response?.data?.message || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await listingsAPI.deleteListing(id);
      
      if (response.status === 'success') {
        toast.success('Listing deleted successfully');
        navigate('/host/dashboard');
      } else {
        toast.error(response.message || 'Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error(error.response?.data?.message || 'Failed to delete listing');
    } finally {
      setLoading(false);
    }
  };

  const formatAmenityName = (amenity) => {
    return amenity.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h1>
          <Button onClick={() => navigate('/host/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/host/dashboard')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Listing</h1>
            <p className="text-gray-600">{listing.title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/listing/${id}`)}
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="title">Listing Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Beautiful apartment in downtown"
                className="mt-1"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your space, what makes it special, and what guests can expect..."
                rows={4}
                className="mt-1"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1000 characters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="roomType">Room Type *</Label>
                <Select value={formData.roomType} onValueChange={(value) => handleInputChange('roomType', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entire_place">Entire Place</SelectItem>
                    <SelectItem value="private_room">Private Room</SelectItem>
                    <SelectItem value="shared_room">Shared Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location & Capacity */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Capacity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.location.address}
                onChange={(e) => handleInputChange('location.address', e.target.value)}
                placeholder="123 Main Street"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange('location.city', e.target.value)}
                  placeholder="New York"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.location.state}
                  onChange={(e) => handleInputChange('location.state', e.target.value)}
                  placeholder="NY"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.location.country}
                  onChange={(e) => handleInputChange('location.country', e.target.value)}
                  placeholder="United States"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.location.zipCode}
                onChange={(e) => handleInputChange('location.zipCode', e.target.value)}
                placeholder="10001"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="guests">Max Guests *</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.capacity.guests}
                  onChange={(e) => handleInputChange('capacity.guests', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.capacity.bedrooms}
                  onChange={(e) => handleInputChange('capacity.bedrooms', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="beds">Beds</Label>
                <Input
                  id="beds"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.capacity.beds}
                  onChange={(e) => handleInputChange('capacity.beds', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={formData.capacity.bathrooms}
                  onChange={(e) => handleInputChange('capacity.bathrooms', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="basePrice">Base Price per Night (USD) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="1"
                  value={formData.pricing.basePrice}
                  onChange={(e) => handleInputChange('pricing.basePrice', e.target.value)}
                  placeholder="100"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cleaningFee">Cleaning Fee (USD)</Label>
                <Input
                  id="cleaningFee"
                  type="number"
                  min="0"
                  value={formData.pricing.cleaningFee}
                  onChange={(e) => handleInputChange('pricing.cleaningFee', e.target.value)}
                  placeholder="25"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="securityDeposit">Security Deposit (USD)</Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  min="0"
                  value={formData.pricing.securityDeposit}
                  onChange={(e) => handleInputChange('pricing.securityDeposit', e.target.value)}
                  placeholder="200"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Add more photos</p>
              <p className="text-sm text-gray-500 mb-4">
                Upload up to 10 photos. JPEG, PNG, or WebP. Max 5MB each.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Photos
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Listing ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                        Cover Photo
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onCheckedChange={() => handleAmenityToggle(amenity)}
                  />
                  <Label htmlFor={amenity} className="text-sm">
                    {formatAmenityName(amenity)}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* House Rules & Policies */}
        <Card>
          <CardHeader>
            <CardTitle>House Rules & Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="houseRules">House Rules</Label>
              <Textarea
                id="houseRules"
                value={formData.houseRules}
                onChange={(e) => handleInputChange('houseRules', e.target.value)}
                placeholder="No smoking, no pets, quiet hours after 10 PM..."
                rows={4}
                className="mt-1"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.houseRules.length}/500 characters</p>
            </div>

            <div>
              <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
              <Select value={formData.cancellationPolicy} onValueChange={(value) => handleInputChange('cancellationPolicy', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select cancellation policy" />
                </SelectTrigger>
                <SelectContent>
                  {cancellationPolicies.map((policy) => (
                    <SelectItem key={policy.value} value={policy.value}>
                      {policy.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="instantBook"
                checked={formData.availability.instantBook}
                onCheckedChange={(checked) => handleInputChange('availability.instantBook', checked)}
              />
              <Label htmlFor="instantBook">
                Enable Instant Book (guests can book immediately without approval)
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/host/dashboard')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="px-8">
            {loading ? 'Saving...' : 'Save Changes'}
            <Save className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditListingPage;

