import React, { useState } from 'react'
import { Heart } from 'lucide-react'

export default function NewArrivals() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [wishlist, setWishlist] = useState({})

  const filters = ['All', 'T-Shirt', 'Shirt', 'Bottom Wears']

  const products = [
    {
      id: 1,
      name: "Pretty Fashionable Men...",
      category: "T-Shirt",
      rating: 4.5,
      price: 287,
      image: "https://picsum.photos/200/300",
    },
    {
      id: 2,
      name: "Pretty Fashionable Men...",
      category: "Shirt",
      rating: 4.8,
      price: 287,
      image: "https://picsum.photos/200/300",
    },
    {
      id: 3,
      name: "Pretty Fashionable Men...",
      category: "Shirt",
      rating: 4.3,
      price: 287,
      image: "https://picsum.photos/200/300",
    },
    {
      id: 4,
      name: "Pretty Fashionable Men...",
      category: "Bottom Wears",
      rating: 4.5,
      price: 287,
      image: "https://picsum.photos/200/300",
    },
    {
      id: 5,
      name: "Pretty Fashionable Men...",
      category: "Bottom Wears",
      rating: 4.7,
      price: 287,
      image: "https://picsum.photos/200/300",
    },
    {
      id: 6,
      name: "Pretty Fashionable Men...",
      category: "Bottom Wears",
      rating: 4.4,
      price: 287,
      image: "https://picsum.photos/200/300",
    },
  ]

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

  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(product => product.category === activeFilter)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">New Arrivals</h2>
        <p className="text-gray-600 text-sm max-w-2xl mx-auto">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus dui
          efficitur vulputate aliquam. Aliquam sem. Suspendisse duis sed nulla.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 object-cover"
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

            <div className="p-4">
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
    </div>
  )
}