import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { productsAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  MinusIcon,
  PlusIcon,
  ArrowLeftIcon,
  ShareIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const imageRef = useRef(null);
  const detailsRef = useRef(null);
  const relatedRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      // Animate product details on load
      const tl = gsap.timeline();
      
      tl.fromTo(imageRef.current,
        { opacity: 0, scale: 0.8, x: -50 },
        { opacity: 1, scale: 1, x: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(detailsRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        '-=0.4'
      );

      // Animate related products
      if (relatedProducts.length > 0) {
        gsap.fromTo(relatedRef.current?.querySelectorAll('.related-card'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.5
          }
        );
      }
    }
  }, [product, relatedProducts]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      setProduct(response.data);
      
      // Fetch related products from same category
      if (response.data.categoryId) {
        fetchRelatedProducts(response.data.categoryId._id, response.data._id);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryId, currentProductId) => {
    try {
      const response = await productsAPI.getAll({ category: categoryId });
      const related = response.data.products?.filter(p => p._id !== currentProductId).slice(0, 4) || [];
      setRelatedProducts(related);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    setShowAddedToCart(true);
    
    // Animate add to cart button
    gsap.to('.add-to-cart-btn', {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowAddedToCart(false), 3000);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    // Animate heart icon
    gsap.to('.favorite-btn', {
      scale: 1.2,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link
            to="/products"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const currentCartQuantity = getItemQuantity(product._id);
  const maxQuantity = Math.min(product.stock, 10); // Limit to 10 or stock, whichever is lower

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-500 hover:text-primary-600">Products</Link>
            <span className="text-gray-400">/</span>
            <Link 
              to={`/products?category=${product.categoryId?.name?.toLowerCase().replace(' ', '-')}`}
              className="text-gray-500 hover:text-primary-600"
            >
              {product.categoryId?.name}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div ref={imageRef} className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-8xl">
                {product.categoryId?.name?.includes('Masala') ? '🌶️' :
                 product.categoryId?.name?.includes('Milk') ? '🥛' : '🌾'}
              </div>
            </div>
            
            {/* Thumbnail images (placeholder) */}
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                  <div className="text-2xl">
                    {product.categoryId?.name?.includes('Masala') ? '🌶️' :
                     product.categoryId?.name?.includes('Milk') ? '🥛' : '🌾'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div ref={detailsRef} className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                  {product.categoryId?.name}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleFavorite}
                    className="favorite-btn p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {isFavorite ? (
                      <HeartSolidIcon className="w-6 h-6 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ShareIcon className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">(4.8) • 124 reviews</span>
                </div>
              </div>
              
              <div className="flex items-baseline space-x-4">
                <span className="text-4xl font-bold text-primary-600">₹{product.price}</span>
                <span className="text-lg text-gray-500 line-through">₹{Math.round(product.price * 1.2)}</span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                  17% OFF
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                product.stock > 10 ? 'bg-green-500' :
                product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <span className={`font-medium ${
                product.stock > 10 ? 'text-green-700' :
                product.stock > 0 ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {product.stock > 10 ? 'In Stock' :
                 product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= maxQuantity}
                      className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">Max: {maxQuantity}</span>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4">
              {product.stock > 0 ? (
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddToCart}
                    className="add-to-cart-btn flex-1 bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
                  >
                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                    Add to Cart
                  </button>
                  {isAuthenticated && (
                    <button className="px-8 py-4 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors">
                      Buy Now
                    </button>
                  )}
                </div>
              ) : (
                <button disabled className="w-full bg-gray-300 text-gray-500 px-8 py-4 rounded-lg font-semibold cursor-not-allowed">
                  Out of Stock
                </button>
              )}
              
              {currentCartQuantity > 0 && (
                <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-secondary-600 mr-2" />
                    <span className="text-secondary-800 font-medium">
                      {currentCartQuantity} item(s) in cart
                    </span>
                  </div>
                </div>
              )}
              
              {showAddedToCart && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
                  <div className="flex items-center">
                    <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Added to cart successfully!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  100% Natural and Organic
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Freshly Ground Spices
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  No Artificial Preservatives
                </li>
                <li className="flex items-center text-gray-600">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  Traditional Recipe
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div ref={relatedRef} className="mt-16">
            <h2 className="font-serif text-3xl font-bold text-gray-800 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="related-card group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl">
                      {relatedProduct.categoryId?.name?.includes('Masala') ? '🌶️' :
                       relatedProduct.categoryId?.name?.includes('Milk') ? '🥛' : '🌾'}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-primary-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-primary-600 font-bold">₹{relatedProduct.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
