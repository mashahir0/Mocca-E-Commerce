import React, { useState } from 'react'
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ProductsList() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [wishlist, setWishlist] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
  const [selectedRatings, setSelectedRatings] = useState([])

  const filters = ['All', 'T-Shirt', 'Shirt', 'Bottom Wears']
  const navigate = useNavigate()
  const priceRanges = [
    { label: 'All prices', value: 'all' },
    { label: 'Under Rs. 100', value: 'under-100' },
    { label: 'Rs. 100 to 500', value: '100-500' },
    { label: 'Rs. 500 to Rs 1000', value: '500-1000' },
    { label: 'Rs. 1000 to Rs. 2000', value: '1000-2000' },
    { label: 'Above Rs. 2000', value: 'above-2000' },
  ]

  const products = Array(9).fill({
    id: 1,
    name: "Pretty Fashionable Men...",
    rating: 4.5,
    price: 287,
    image: "/placeholder.svg?height=300&width=250",
  }).map((product, index) => ({
    ...product,
    id: index + 1
  }))

  const toggleWishlist = (productId) => {
    setWishlist(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }))
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < Math.floor(rating) 
            ? 'text-yellow-400' 
            : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ))
  }

  const handlePriceRangeChange = (value) => {
    setSelectedPriceRanges(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    )
  }

  const handleRatingChange = (rating) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 space-y-6">
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
                    {[...Array(5-rating)].map((_, i) => (
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
          {/* Category Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
                  ${activeFilter === filter
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" >
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden"
                onClick={()=>navigate('/productinfo')}
              >
                <div className="relative"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                   
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <Heart 
                      className={`h-5 w-5 ${
                        wishlist[product.id] 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-600'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4"
                >
                  <h3 className="font-medium text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-2">
                    {renderStars(product.rating)}
                    <span className="text-gray-600 text-sm ml-1">
                      ({product.rating})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      ₹{product.price}
                    </span>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === 3}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}