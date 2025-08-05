import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { store } from '../store';
import {
  addToCart,
  selectCartItemQuantity,
} from '../store/cartSlice';
import {
  addToWishlist,
  removeFromWishlist,
  selectIsInWishlist,
} from '../store/wishlistSlice';
import { products } from '../product';
import { latestProducts } from '../Latest';
import { FaHeart, FaEye, FaShoppingCart, FaFilter, FaSearch, FaTh, FaList, FaThLarge } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineAddShoppingCart, MdCompareArrows } from 'react-icons/md';
import { IoIosStar, IoIosStarOutline } from 'react-icons/io';
import { TiHeartOutline } from "react-icons/ti";
import AOS from "aos";
import "aos/dist/aos.css";
import ProductDetailModal from './ProductDetailModal';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [addingToCart, setAddingToCart] = useState(null);
  const [addingToWishlist, setAddingToWishlist] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'price', 'rating'
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combine all products
  const allProducts = [...products, ...latestProducts];

  // Get unique categories
  const categories = ['all', ...new Set(allProducts.map(product => product.category))];

  const navigate = useNavigate();

  // Get category and search parameters from URL
  useEffect(() => {
    // First check URL path parameters (from /category/:category)
    const pathSegments = location.pathname.split('/');
    if (pathSegments[1] === 'category' && pathSegments[2]) {
      setFilterCategory(decodeURIComponent(pathSegments[2]));
    }
    // Then check location state (from Link state prop)
    else if (location.state && location.state.category) {
      setFilterCategory(location.state.category);
      
      // Clear the state to prevent issues when navigating back
      navigate(location.pathname, { replace: true, state: {} });
    }
    
    // Check for query parameters (category and search)
    const queryParams = new URLSearchParams(location.search);
    
    // Handle category parameter
    const categoryParam = queryParams.get('category');
    if (categoryParam) {
      setFilterCategory(categoryParam);
    }
    
    // Handle search parameter
    const searchParam = queryParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location, navigate]);

  useEffect(() => {
    AOS.init({ offset: 100, duration: 500, easing: "ease-in-out" });
  }, []);

  const handleAddToCart = async (product) => {
    setAddingToCart(product.id);
    dispatch(addToCart(product));
    
    setTimeout(() => {
      setAddingToCart(null);
    }, 500);
  };

  const handleToggleWishlist = async (product) => {
    setAddingToWishlist(product.id);
    // Get the current wishlist state directly from the store
    const isInWishlist = selectIsInWishlist(store.getState(), product.id);
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
    
    setTimeout(() => {
      setAddingToWishlist(null);
    }, 300);
  };

  const handleEyeClick = (product) => {
    
    navigate('/cart');
    // Scroll to top after navigation
    window.scrollTo(0, 0);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Filter and sort products
  const filteredProducts = allProducts
    .filter(product => {
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const price = parseFloat(product.price.replace(/[$Rs,]/g, ''));
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      
      return matchesCategory && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          const priceA = parseFloat(a.price.replace(/[$Rs,]/g, ''));
          const priceB = parseFloat(b.price.replace(/[$Rs,]/g, ''));
          return priceA - priceB;
        case 'rating':
          return 5 - 5; // Since all have same rating, no change
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const renderStars = (rating = 5) => {
    return [...Array(5)].map((_, i) => (
      i < rating ? 
        <IoIosStar key={i} className="text-yellow-400 text-sm" /> :
        <IoIosStarOutline key={i} className="text-gray-300 text-sm" />
    ));
  };

  const ProductCard = ({ product, isListView = false }) => {
    const cartQuantity = useSelector(state => selectCartItemQuantity(state, product.id));
    const isInWishlist = useSelector(state => selectIsInWishlist(state, product.id));
    const isAddingToCart = addingToCart === product.id;
    const isAddingToWishlistState = addingToWishlist === product.id;
    const price = parseFloat(product.price.replace(/[$Rs,]/g, ''));
    const originalPrice = price * 1.16; // Assuming 14% discount

    if (isListView) {
      return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition duration-300 p-6 flex gap-6">
          <div className="relative flex-shrink-0">
            <img 
              src={product.img || product.image} 
              alt={product.name} 
              className="w-32 h-32 object-cover rounded-lg"
            />
            {cartQuantity > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartQuantity}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleWishlist(product)}
                  className={`p-2 transition ${
                    isInWishlist
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                  disabled={isAddingToWishlistState}
                >
                  {isAddingToWishlistState ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                  ) : (
                    isInWishlist ? <FaHeart /> : <TiHeartOutline />
                  )}
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-500 transition">
                  <MdCompareArrows />
                </button>
                <button
                  onClick={() => handleEyeClick(product)}
                  className="p-2 text-gray-400 hover:text-green-500 transition"
                >
                  <FaEye />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {renderStars(5)}
              </div>
              <span className="text-sm text-gray-500">(4.5)</span>
              <span className="text-sm text-gray-500">• 127 reviews</span>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">
              High-quality {product.category.toLowerCase()} with premium features and excellent performance. 
              Perfect for daily use with long-lasting durability.
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#5C2EC0]">{product.price}</span>
                <span className="text-lg text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">14% OFF</span>
              </div>
              
              <button
                onClick={() => handleAddToCart(product)}
                disabled={isAddingToCart}
                className={`px-6 py-2 rounded-lg font-semibold transition duration-300 flex items-center gap-2 ${
                  isAddingToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-[#5C2EC0] text-white hover:bg-[#4a25a3]'
                }`}
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <MdOutlineAddShoppingCart />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition duration-300 overflow-hidden">
        <div className="relative">
          <img 
            src={product.img || product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">14% OFF</span>
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Best Seller</span>
          </div>
          
          {/* Cart Quantity Badge */}
          {cartQuantity > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
              {cartQuantity} in cart
            </div>
          )}
          
          {/* Hover Actions */}
          <div className="absolute inset-0 bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-3">
            <button
              onClick={() => handleEyeClick(product)}
              className="bg-[#5C2EC0] p-3 rounded-full hover:bg-white  transition transform hover:scale-110"
            >
              <FaEye className="text-white hover:text-[#5C2EC0]" />
            </button>
            {/* <button
              onClick={() => handleToggleWishlist(product)}
              disabled={isAddingToWishlistState}
              className={`p-3 rounded-full transition transform hover:scale-110 ${
                isInWishlist
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {isAddingToWishlistState ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                isInWishlist ? <FaHeart className="text-white" /> : <TiHeartOutline className="text-[#5C2EC0]" />
              )}
            </button> */}
            {/* <button className="bg-white p-3 rounded-full hover:bg-gray-100 transition transform hover:scale-110">
              <MdCompareArrows className="text-[#5C2EC0]" />
            </button> */}
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.category}</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#5C2EC0] transition">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {renderStars(5)}
            </div>
            <span className="text-sm text-gray-500">(4.5)</span>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-[#5C2EC0]">{product.price}</span>
            <span className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleAddToCart(product)}
              disabled={isAddingToCart}
              className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-300 ${
                isAddingToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-[#5C2EC0] text-white hover:bg-[#4a25a3]'
              }`}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              onClick={() => handleToggleWishlist(product)}
              disabled={isAddingToWishlistState}
              className={`p-2 border rounded-lg transition ${
                isInWishlist
                  ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100'
                  : 'border-gray-300 hover:border-[#5C2EC0] hover:text-[#5C2EC0]'
              }`}
            >
              {isAddingToWishlistState ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                isInWishlist ? <FaHeart /> : <TiHeartOutline />
              )}
            </button>
          </div>
          
          {/* Stock Info */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-green-600">✓ In Stock</span>
            <span className="text-gray-500">
              {(product.maxStock || 99) - (cartQuantity || 0)} left
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our extensive collection of premium electronics and accessories. 
            From cutting-edge gadgets to everyday essentials, find everything you need.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8" data-aos="fade-up" data-aos-delay="100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5C2EC0]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5C2EC0]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#5C2EC0]"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 py-2 px-4 rounded-lg transition ${
                  viewMode === 'grid'
                    ? 'bg-[#5C2EC0] text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <FaThLarge className="mx-auto" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 py-2 px-4 rounded-lg transition ${
                  viewMode === 'list'
                    ? 'bg-[#5C2EC0] text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                <FaList className="mx-auto" />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Showing {filteredProducts.length} of {allProducts.length} products</span>
            <span>Free shipping on orders over $50</span>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-6'
        }`} data-aos="fade-up" data-aos-delay="200">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isListView={viewMode === 'list'}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16" data-aos="fade-up">
            <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setPriceRange([0, 1000]);
              }}
              className="bg-[#5C2EC0] text-white px-6 py-2 rounded-lg hover:bg-[#4a25a3] transition duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12" data-aos="fade-up">
            <button className="bg-[#5C2EC0] text-white px-8 py-3 rounded-lg hover:bg-[#4a25a3] transition duration-300 font-semibold">
              Load More Products
            </button>
          </div>
        )}
      </div>
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProductsPage;