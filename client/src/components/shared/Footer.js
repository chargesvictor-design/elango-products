import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { configAPI } from '../../utils/api';

const Footer = () => {
  const [config, setConfig] = useState({
    site_name: 'Elango Home Made Products',
    contact_email: 'info@elangoproducts.com',
    contact_phone: '+91-9876543210'
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await configAPI.getConfig();
        setConfig(response.data);
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
    fetchConfig();
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-serif text-2xl font-bold text-primary-400 mb-4">
              {config.site_name}
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Premium quality home made products crafted with love and tradition. 
              We bring you authentic flavors and the finest ingredients for your kitchen.
            </p>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-medium">Email:</span> {config.contact_email}
              </p>
              <p className="text-gray-300">
                <span className="font-medium">Phone:</span> {config.contact_phone}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/products/category/masala-items" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Masala Items
                </Link>
              </li>
              <li>
                <Link 
                  to="/products/category/milk-products" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Milk Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/products/category/grocery-items" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Grocery Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/orders" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Track Orders
                </Link>
              </li>
              <li>
                <Link 
                  to="/cart" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
              <li>
                <a 
                  href={`mailto:${config.contact_email}`}
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href={`tel:${config.contact_phone}`}
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  Call Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} {config.site_name}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
              >
                Return Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
