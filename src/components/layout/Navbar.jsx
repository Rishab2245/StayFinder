import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import {
  Search,
  Menu,
  User,
  Home,
  Calendar,
  Settings,
  LogOut,
  Plus,
  BarChart3,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const Navbar = () => {
  const { user, isAuthenticated, logout, isHost } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBecomeHost = () => {
    if (isAuthenticated) {
      if (isHost()) {
        navigate('/host/dashboard');
      } else {
        navigate('/become-host');
      }
    } else {
      navigate('/register');
    }
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
  };

  const isSearchPage = location.pathname === '/search';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">StayFinder</span>
          </Link>

          {/* Search Bar - Hidden on mobile, shown on larger screens */}
          {!isSearchPage && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <button
                onClick={() => navigate('/search')}
                className="search-bar w-full px-4 py-2 flex items-center space-x-3 text-gray-500 hover:shadow-lg transition-all duration-300"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Where are you going?</span>
              </button>
            </div>
          )}

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Become a Host */}
            <Button
              variant="ghost"
              onClick={handleBecomeHost}
              className="text-sm font-medium hover:bg-gray-50"
            >
              {isHost() ? 'Host Dashboard' : 'Become a Host'}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 px-3 py-2 rounded-full border-gray-300 hover:shadow-md"
                  >
                    <Menu className="w-4 h-4" />
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={user?.avatar} alt={user?.firstName} />
                      <AvatarFallback className="text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/bookings" className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>My Bookings</span>
                    </Link>
                  </DropdownMenuItem>

                  {isHost() && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/host/dashboard" className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4" />
                          <span>Host Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/host/listing/new" className="flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Add Listing</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-red-600">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Search button for mobile */}
            {!isSearchPage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/search')}
              >
                <Search className="w-5 h-5" />
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user?.avatar} alt={user?.firstName} />
                        <AvatarFallback className="text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/bookings"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="w-5 h-5" />
                    <span>My Bookings</span>
                  </Link>

                  {isHost() && (
                    <>
                      <Link
                        to="/host/dashboard"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <BarChart3 className="w-5 h-5" />
                        <span>Host Dashboard</span>
                      </Link>
                      <Link
                        to="/host/listing/new"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add Listing</span>
                      </Link>
                    </>
                  )}

                  <button
                    onClick={() => {
                      handleBecomeHost();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                  >
                    <Home className="w-5 h-5" />
                    <span>{isHost() ? 'Host Dashboard' : 'Become a Host'}</span>
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <button
                    onClick={() => {
                      handleBecomeHost();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left"
                  >
                    Become a Host
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

