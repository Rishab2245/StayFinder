import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Page components
import HomePage from './components/pages/HomePage';
import SearchPage from './components/pages/SearchPage';
import ListingDetailPage from './components/pages/ListingDetailPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProfilePage from './components/pages/ProfilePage';
import BookingsPage from './components/pages/BookingsPage';
import HostDashboard from './components/pages/HostDashboard';
import CreateListingPage from './components/pages/CreateListingPage';
import EditListingPage from './components/pages/EditListingPage';
import BookingDetailPage from './components/pages/BookingDetailPage';
import PaymentPage from './components/pages/PaymentPage';
import BecomeHostPage from './components/pages/BecomeHostPage';



// Loading component
import LoadingSpinner from './components/ui/LoadingSpinner';

import './App.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children, requireHost = false }) => {
  const { isAuthenticated, isLoading, isHost } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireHost && !isHost()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

// App Routes component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      <Route path="/search" element={<AppLayout><SearchPage /></AppLayout>} />
      <Route path="/listing/:id" element={<AppLayout><ListingDetailPage /></AppLayout>} />
      
      {/* Auth routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />

      {/* Protected routes */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <AppLayout><ProfilePage /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bookings" 
        element={
          <ProtectedRoute>
            <AppLayout><BookingsPage /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bookings/:id" 
        element={
          <ProtectedRoute>
            <AppLayout><BookingDetailPage /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment/:id" 
        element={
          <ProtectedRoute>
            <AppLayout><PaymentPage /></AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Become Host route */}
      <Route 
        path="/become-host" 
        element={
          <ProtectedRoute>
            <BecomeHostPage />
          </ProtectedRoute>
        } 
      />


      {/* Host routes */}
      <Route 
        path="/host/dashboard" 
        element={
          <ProtectedRoute requireHost={true}>
            <AppLayout><HostDashboard /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/host/listing/new" 
        element={
          <ProtectedRoute requireHost={true}>
            <AppLayout><CreateListingPage /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/host/listing/:id/edit" 
        element={
          <ProtectedRoute requireHost={true}>
            <AppLayout><EditListingPage /></AppLayout>
          </ProtectedRoute>
        } 
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

