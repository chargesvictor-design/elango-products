import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { productsAPI, categoriesAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { 
  ShoppingCartIcon, 
  StarIcon, 
  FunnelIcon,
  MagnifyingGlassIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

gsap.registerPlugin(ScrollTrigger);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const productsRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    
    // Check for category filter in URL
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    // Animate header on mount
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    // Animate product cards when they load
    if (products.length > 0) {
      gsap.fromTo(productsRef.current.querySelectorAll('.product-card'),
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: productsRef.current,
            start: 'top 80%',
          }
        }
      );
    }
  }, [products]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // GSAP animation for add to cart button
    const button = e.currentTarget;
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });
    
    addToCart(product);
  };

  const toggleFavorite = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || 
      product.categoryId?.name?.toLowerCase().replace(' ', '-') === selectedCategory.replace('-items', '').replace('-products', '').replace('-', ' ');
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoryProducts = {
    'masala': filteredProducts.filter(p => p.categoryId?.name?.toLowerCase().includes('masala')),
    'milk': filteredProducts.filter(p => p.categoryId?.name?.toLowerCase().includes('milk')),
    'grocery': filteredProducts.filter(p => p.categoryId?.name?.toLowerCase().includes('grocery'))
  };

  const ProductCard = ({ product }) => (
    <Link
      to={`/product/${product._id}`}
      className="product-card group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1"
    >
      <div className="relative overflow-hidden">
        <div className="w-full h-64 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
          <div className="text-6xl">
            {product.categoryId?.name?.includes('Masala') ? '🌶️' :
             product.categoryId?.name?.includes('Milk') ? '🥛' : '🌾'}
          </div>
        </div>
        
        {/* Favorite button */}
        <button
          onClick={(e) => toggleFavorite(product._id, e)}
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
        >
          {favorites.includes(product._id) ? (
            <HeartSolidIcon className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
        
        {/* Stock badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.stock > 10 ? 'bg-green-100 text-green-800' :
            product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-serif text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center ml-2">
            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.8</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-600">₹{product.price}</span>
            <span className="text-sm text-gray-500">{product.categoryId?.name}</span>
          </div>
          
          <button
            onClick={(e) => handleAddToCart(product, e)}
            disabled={product.stock === 0}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isInCart(product._id)
                ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            <ShoppingCartIcon className="w-4 h-4 mr-1" />
            {product.stock === 0 ? 'Out of Stock' :
             isInCart(product._id) ? `In Cart (${getItemQuantity(product._id)})` : 'Add to Cart'}
          </button>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section ref={headerRef} className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Our Products
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our authentic collection of home-made products
            </p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Categories</option>
                <option value="masala-items">Masala Items</option>
                <option value="milk-products">Milk Products</option>
                <option value="grocery-items">Grocery Items</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsRef} className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {selectedCategory === 'all' ? (
            // Show products grouped by category
            <div className="space-y-16">
              {/* Masala Items */}
              {categoryProducts.masala.length > 0 && (
                <div>
                  <h2 className="font-serif text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <span className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl mr-4">🌶️</span>
                    Masala Items
                    <span className="ml-4 text-lg text-gray-500 font-normal">({categoryProducts.masala.length} items)</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryProducts.masala.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Milk Products */}
              {categoryProducts.milk.length > 0 && (
                <div>
                  <h2 className="font-serif text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <span className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-xl mr-4">🥛</span>
                    Milk Products
                    <span className="ml-4 text-lg text-gray-500 font-normal">({categoryProducts.milk.length} items)</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryProducts.milk.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Grocery Items */}
              {categoryProducts.grocery.length > 0 && (
                <div>
                  <h2 className="font-serif text-3xl font-bold text-gray-800 mb-8 flex items-center">
                    <span className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xl mr-4">🌾</span>
                    Grocery Items
                    <span className="ml-4 text-lg text-gray-500 font-normal">({categoryProducts.grocery.length} items)</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryProducts.grocery.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show filtered products
            <div>
              <h2 className="font-serif text-3xl font-bold text-gray-800 mb-8">
                {selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                <span className="ml-4 text-lg text-gray-500 font-normal">({filteredProducts.length} items)</span>
              </h2>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;
