import { format, parseISO, differenceInDays, addDays, isAfter, isBefore } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Class name utility function
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Date utilities
export const formatDate = (date, formatString = 'MMM dd, yyyy') => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

export const formatDateRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '';
  const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
  
  const checkInFormatted = format(checkInDate, 'MMM dd');
  const checkOutFormatted = format(checkOutDate, 'MMM dd, yyyy');
  
  return `${checkInFormatted} - ${checkOutFormatted}`;
};

export const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const checkInDate = typeof checkIn === 'string' ? parseISO(checkIn) : checkIn;
  const checkOutDate = typeof checkOut === 'string' ? parseISO(checkOut) : checkOut;
  return differenceInDays(checkOutDate, checkInDate);
};

export const isDateAvailable = (date, unavailableDates = []) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isBefore(date, today)) return false;
  
  return !unavailableDates.some(unavailableDate => {
    const unavailable = typeof unavailableDate === 'string' ? parseISO(unavailableDate) : unavailableDate;
    return format(date, 'yyyy-MM-dd') === format(unavailable, 'yyyy-MM-dd');
  });
};

// Price utilities
export const formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculateTotalPrice = (basePrice, nights, cleaningFee = 0, serviceFee = 0, taxes = 0, discount = 0) => {
  const subtotal = basePrice * nights;
  return subtotal + cleaningFee + serviceFee + taxes - discount;
};

export const calculateServiceFee = (subtotal, rate = 0.14) => {
  return Math.round(subtotal * rate);
};

export const calculateTaxes = (subtotal, rate = 0.12) => {
  return Math.round(subtotal * rate);
};

// String utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatPropertyType = (type) => {
  const typeMap = {
    'entire_place': 'Entire place',
    'private_room': 'Private room',
    'shared_room': 'Shared room',
    'apartment': 'Apartment',
    'house': 'House',
    'villa': 'Villa',
    'condo': 'Condo',
    'townhouse': 'Townhouse',
    'loft': 'Loft',
    'cabin': 'Cabin',
    'cottage': 'Cottage',
    'studio': 'Studio',
    'other': 'Other'
  };
  return typeMap[type] || capitalizeFirst(type);
};

// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

// Rating utilities
export const formatRating = (rating) => {
  if (!rating) return '0.0';
  return Number(rating).toFixed(1);
};

export const getRatingText = (rating) => {
  if (rating >= 4.8) return 'Exceptional';
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very good';
  if (rating >= 3.5) return 'Good';
  if (rating >= 3.0) return 'Fair';
  return 'Poor';
};

export const generateStarRating = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    fullStars,
    hasHalfStar,
    emptyStars
  };
};

// Image utilities
export const getImageUrl = (imagePath, fallback = '/placeholder-image.jpg') => {
  if (!imagePath) return fallback;
  if (imagePath.startsWith('http')) return imagePath;
  return `https://stayfinder-backend-5yvk.onrender.com/api ${imagePath}`;
};

export const generateImageAlt = (title, index = 0) => {
  return `${title} - Image ${index + 1}`;
};

// URL utilities
export const buildSearchUrl = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  
  return searchParams.toString();
};

export const parseSearchParams = (searchString) => {
  const params = new URLSearchParams(searchString);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
};

// Local storage utilities
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Device detection
export const isMobile = () => {
  return window.innerWidth <= 768;
};

export const isTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

export const isDesktop = () => {
  return window.innerWidth > 1024;
};


