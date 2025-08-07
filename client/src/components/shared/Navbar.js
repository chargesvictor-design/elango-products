import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { configAPI } from '../../utils/api';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteName, setSiteName] = useState('Elango Home Made Products');

  useEffect(() => {
    const fetchSiteName = async () => {
      try {
        const response = await configAPI.getSiteName();
        setSiteName(response.data.site_name);
      } catch (error) {
        console.error('Error fetching site name:', error);
      }
    };
    fetchSiteName();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 font-serif text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            onClick={closeMenu}
          >
            {siteName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
            >
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/orders" 
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  My Orders
                </Link>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                  >
                    Admin
                  </Link>
                )}
                
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/cart" 
                    className="relative text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <ShoppingCartIcon className="h-6 w-6" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                  
                  <div className="flex items-center space-x-2">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-700 font-medium">{user?.name}</span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/cart" 
                  className="relative text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>
                
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link 
                to="/" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={closeMenu}
              >
                Products
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/orders" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                    onClick={closeMenu}
                  >
                    My Orders
                  </Link>
                  
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                      onClick={closeMenu}
                    >
                      Admin
                    </Link>
                  )}
                  
                  <Link 
                    to="/cart" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                    onClick={closeMenu}
                  >
                    Cart ({itemCount})
                  </Link>
                  
                  <div className="px-3 py-2 text-gray-700 font-medium">
                    Welcome, {user?.name}
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/cart" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                    onClick={closeMenu}
                  >
                    Cart ({itemCount})
                  </Link>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-gray-700 hover:text-primary-600 transition-colors font-medium"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 text-primary-600 hover:text-primary-700 transition-colors font-medium"
                    onClick={closeMenu}
                  >
                    Register
                  </Link>
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
