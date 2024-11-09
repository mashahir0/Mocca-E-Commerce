import React, { useState } from 'react'
import { Heart } from 'lucide-react'

export default function TrendingPro() {
  const [wishlist, setWishlist] = useState({})

  const products = [
    {
      id: 1,
      name: "Pretty Fashionable Men...",
      rating: 4.5,
      price: 287,
      image: "https://picsum.photos/200/300"
    },
    {
      id: 2,
      name: "Pretty Fashionable Men...",
      rating: 4.8,
      price: 287,
      image: "https://picsum.photos/200/300"
    },
    {
      id: 3,
      name: "Pretty Fashionable Men...",
      rating: 4.3,
      price: 287,
      image: "https://picsum.photos/200/300"
    }
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Trending</h2>
        <p className="text-gray-600 text-sm">
          Check out most recent products bought by our buyers
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="relative">
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