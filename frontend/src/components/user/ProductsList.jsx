

import React, { useState, useEffect } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../services/api/userApi'

// Fetch products function

const fetchProducts = async (currentPage, activeFilter, selectedPriceRanges, selectedRatings) => {
  try {
      
      const params = {
          page: currentPage,
          category: activeFilter !== 'All' ? activeFilter : undefined,
          price: selectedPriceRanges.length > 0 ? selectedPriceRanges.join(',') : undefined,
          rating: selectedRatings.length > 0 ? selectedRatings.join(',') : undefined,
      };

      
      const response = await axios.get('/get-allproducts', { params });
      return response.data;
  } catch (error) {
      console.error('Error fetching products:', error);
      throw error; 
  }
};
const ProductsList = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState({});
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', currentPage, activeFilter, selectedPriceRanges, selectedRatings],
    queryFn: () => fetchProducts(currentPage, activeFilter, selectedPriceRanges, selectedRatings),
    keepPreviousData: true,
    retry: 1,
    onError: (err) => console.error('Query Error:', err),
  });

  const products = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };

  const filters = ['All', 'T-Shirt', 'Shirt', 'Bottom Wears'];

  const priceRanges = [
    { label: 'All prices', value: 'all' },
    { label: 'Under Rs. 100', value: 'under-100' },
    { label: 'Rs. 100 to 500', value: '100-500' },
    { label: 'Rs. 500 to Rs 1000', value: '500-1000' },
    { label: 'Rs. 1000 to Rs. 2000', value: '1000-2000' },
    { label: 'Above Rs. 2000', value: 'above-2000' },
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={`text-sm ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handlePriceRangeChange = (value) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const filterByPrice = (product) => {
    if (selectedPriceRanges.length === 0 || selectedPriceRanges.includes('all')) return true;
    if (selectedPriceRanges.includes('under-100') && product.price < 100) return true;
    if (selectedPriceRanges.includes('100-500') && product.price >= 100 && product.price <= 500) return true;
    if (selectedPriceRanges.includes('500-1000') && product.price >= 500 && product.price <= 1000) return true;
    if (selectedPriceRanges.includes('1000-2000') && product.price >= 1000 && product.price <= 2000) return true;
    if (selectedPriceRanges.includes('above-2000') && product.price > 2000) return true;
    return false;
  };

  const filterByRating = (product) => {
    if (selectedRatings.length === 0) return true;
    return selectedRatings.includes(Math.floor(product.rating));
  };

  const filteredProducts = products
    .filter(filterByPrice)
    .filter(filterByRating);

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Error loading products: {error.message}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="font-semibold mb-3">Filter by Category</h3>
            <div className="space-y-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-semibold mb-3">Filter by Price</h3>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label key={range.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.includes(range.value)}
                    onChange={() => handlePriceRangeChange(range.value)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <h3 className="font-semibold mb-3">Filter by Ratings</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedRatings.length === 0}
                  onChange={() => setSelectedRatings([])}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">All Ratings</span>
              </label>
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(rating)}
                    onChange={() => handleRatingChange(rating)}
                    className="rounded border-gray-300"
                  />
                  <span className="flex">
                    {[...Array(rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                    {[...Array(5 - rating)].map((_, i) => (
                      <span key={i} className="text-gray-300">★</span>
                    ))}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  
                >
                  <div className="relative">
                    <img
                      src={product.mainImage?.[0] || 'default-image.jpg'}
                      alt={product.productName}
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <Heart
                        className={`h-5 w-5 ${wishlist[product._id] ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{product.productName}</h3>
                    <div className="flex items-center mb-2">
                      {renderStars(product.averageRating )}
                      <span className="text-gray-600 text-sm ml-1">({product.averageRating || 0 })</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">₹{product.salePrice}</span>
                      <a href="#" className="text-sm text-blue-600 hover:underline"
                      onClick={() => navigate(`/productinfo/${product._id}`)}>
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page ? 'bg-black text-white' : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === pagination.totalPages}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;

