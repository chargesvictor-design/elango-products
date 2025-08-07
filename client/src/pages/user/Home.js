import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { configAPI } from '../../utils/api';
import { ShoppingCartIcon, StarIcon } from '@heroicons/react/24/solid';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const categoriesRef = useRef(null);
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

  useEffect(() => {
    // Hero section animations
    const tl = gsap.timeline();
    
    tl.fromTo(heroRef.current.querySelector('.hero-title'), 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    )
    .fromTo(heroRef.current.querySelector('.hero-subtitle'), 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5'
    )
    .fromTo(heroRef.current.querySelector('.hero-cta'), 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3'
    );

    // Featured products animation
    gsap.fromTo(featuredRef.current.querySelectorAll('.featured-card'),
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
        }
      }
    );

    // Categories animation
    gsap.fromTo(categoriesRef.current.querySelectorAll('.category-card'),
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: categoriesRef.current,
          start: 'top 85%',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const featuredProducts = [
    {
      id: 1,
      name: 'Sambhar Masala',
      price: 120,
      image: '/images/sambhar-masala.jpg',
      description: 'Authentic South Indian sambhar masala powder',
      rating: 4.8
    },
    {
      id: 2,
      name: 'Rasam Powder',
      price: 100,
      image: '/images/rasam-powder.jpg',
      description: 'Tangy and flavorful rasam powder',
      rating: 4.7
    },
    {
      id: 3,
      name: 'Turmeric Powder',
      price: 80,
      image: '/images/turmeric-powder.jpg',
      description: 'Pure and organic turmeric powder',
      rating: 4.9
    }
  ];

  const categories = [
    {
      name: 'Masala Items',
      description: 'Traditional spice blends',
      image: '/images/masala-category.jpg',
      color: 'from-orange-400 to-red-500',
      link: '/products?category=masala-items'
    },
    {
      name: 'Milk Products',
      description: 'Fresh dairy products',
      image: '/images/milk-category.jpg',
      color: 'from-blue-400 to-indigo-500',
      link: '/products?category=milk-products'
    },
    {
      name: 'Grocery Items',
      description: 'Essential grocery staples',
      image: '/images/grocery-category.jpg',
      color: 'from-green-400 to-emerald-500',
      link: '/products?category=grocery-items'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative bg-gradient-to-br from-primary-50 via-orange-50 to-yellow-50 py-20 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/images/spices-pattern.png')] opacity-5"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="hero-title font-serif text-5xl md:text-7xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-primary-600 to-orange-600 bg-clip-text text-transparent">
              {siteName}
            </span>
          </h1>
          <p className="hero-subtitle text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Premium quality home made products crafted with love and tradition. 
            Experience authentic flavors and the finest ingredients for your kitchen.
          </p>
          <div className="hero-cta">
            <Link 
              to="/products" 
              className="inline-flex items-center bg-gradient-to-r from-primary-600 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-primary-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ShoppingCartIcon className="w-6 h-6 mr-2" />
              Shop Now
            </Link>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-orange-400 rounded-full opacity-20 animate-bounce-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-red-400 rounded-full opacity-20 animate-bounce-slow" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Featured Products Section */}
      <section ref={featuredRef} className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and authentic home-made products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id}
                className="featured-card group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative overflow-hidden">
                  <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center">
                    <div className="text-6xl">🌶️</div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                    <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium ml-1">{product.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-serif text-2xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{product.price}
                    </span>
                    <Link
                      to={`/product/${product.id}`}
                      className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 font-medium"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated categories of authentic products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="category-card group block"
              >
                <div className={`relative bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white overflow-hidden transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-2xl`}>
                  <div className="relative z-10">
                    <h3 className="font-serif text-2xl font-bold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/90 mb-4">
                      {category.description}
                    </p>
                    <div className="inline-flex items-center text-white font-medium">
                      Explore Products
                      <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience Authentic Flavors?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who trust our quality and authenticity
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-white text-primary-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Start Shopping
            <ShoppingCartIcon className="w-6 h-6 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
