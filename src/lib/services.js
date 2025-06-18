import api from './api';

// Authentication API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  },

  becomeHost: async (hostData) => {
    console.log('becomeHost called with data:', hostData);
    const response = await api.post('/auth/become-host', hostData);
    console.log('Response from becomeHost:', response);
    return response.data;
  },
};

// Listings API
export const listingsAPI = {
  getListings: async (params = {}) => {
    const response = await api.get('/listings', { params });
    return response.data;
  },

  getListing: async (id) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  createListing: async (listingData) => {
    const response = await api.post('/listings', listingData);
    return response.data;
  },

  updateListing: async (id, listingData) => {
    const response = await api.put(`/listings/${id}`, listingData);
    return response.data;
  },

  deleteListing: async (id) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },

  getMyListings: async (params = {}) => {
    const response = await api.get('/listings/host/my-listings', { params });
    return response.data;
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async (params = {}) => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  getHostBookings: async (params = {}) => {
    const response = await api.get('/bookings/host-bookings', { params });
    return response.data;
  },

  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id, statusData) => {
    const response = await api.put(`/bookings/${id}/status`, statusData);
    return response.data;
  },

  addMessage: async (id, messageData) => {
    const response = await api.post(`/bookings/${id}/messages`, messageData);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  addReview: async (id, reviewData) => {
    const response = await api.post(`/users/${id}/reviews`, reviewData);
    return response.data;
  },

  getUserReviews: async (id, params = {}) => {
    const response = await api.get(`/users/${id}/reviews`, { params });
    return response.data;
  },

  uploadAvatar: async (avatarData) => {
    const response = await api.post('/users/avatar', avatarData);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/users/stats/dashboard');
    return response.data;
  },

  searchUsers: async (params = {}) => {
    const response = await api.get('/users/search', { params });
    return response.data;
  },
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};


