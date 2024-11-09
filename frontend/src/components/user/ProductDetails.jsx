import React, { useState } from 'react'
import { Star, ShoppingCart } from 'lucide-react'

export default function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  const images = [
    'https://picsum.photos/200/300?grayscale',
    'https://picsum.photos/200/300?grayscale',
    'https://picsum.photos/id/237/200/300',
    'https://picsum.photos/id/237/200/300'
  ]

  const sizes = ['M', 'L', 'XL']

  const productDetails = {
    name: 'Printed Polyester Tshirt',
    price: 195,
    rating: 4,
    brand: 'ABC',
    sleeveLength: 'Short Sleeves',
    pattern: 'Printed',
    netQuantity: 'N/1',
    sizes: [
      'L (Chest Size : 40 in, Length Size: 29 in)',
      'XL (Chest Size : 42 in, Length Size: 29 in)'
    ]
  }

  const reviews = [
    { id: 1, title: 'Review title', body: 'Review body', rating: 5, author: 'Reviewer name', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 2, title: 'Review title', body: 'Review body', rating: 5, author: 'Reviewer name', avatar: '/placeholder.svg?height=40&width=40' },
    { id: 3, title: 'Review title', body: 'Review body', rating: 5, author: 'Reviewer name', avatar: '/placeholder.svg?height=40&width=40' }
  ]

  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        onClick={() => interactive && setRating(index + 1)}
        className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <Star 
          className={`h-5 w-5 ${
            index < rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300'
          }`}
        />
      </button>
    ))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 border rounded-lg overflow-hidden ${
                  selectedImage === index ? 'border-black' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-square rounded-lg overflow-hidden">
            <img
              src={images[selectedImage]}
              alt="Selected product"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">{productDetails.name}</h1>
            <div className="flex items-center gap-2 mb-2">
              {renderStars(productDetails.rating)}
              <span className="text-gray-500">({productDetails.rating})</span>
            </div>
            <p className="text-2xl font-bold">₹{productDetails.price}</p>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h2 className="font-semibold">Product Details</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Name:</span> {productDetails.name}</p>
              <p><span className="text-gray-600">Brand:</span> {productDetails.brand}</p>
              <p><span className="text-gray-600">Sleeve Length:</span> {productDetails.sleeveLength}</p>
              <p><span className="text-gray-600">Pattern:</span> {productDetails.pattern}</p>
              <p><span className="text-gray-600">Net Quantity:</span> {productDetails.netQuantity}</p>
              <div className="space-y-1">
                <p className="text-gray-600">Sizes:</p>
                {productDetails.sizes.map((size, index) => (
                  <p key={index} className="ml-4">- {size}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <p className="font-semibold mb-2">Select Size</p>
            <div className="flex gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-full border ${
                    selectedSize === size
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border-r hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border-l hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-black rounded-md hover:bg-gray-50">
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <button className="flex-1 px-6 py-3 bg-black text-white rounded-md hover:bg-black/90">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-6">Add Review</h2>
        <div className="max-w-2xl">
          <div className="flex gap-2 mb-4">
            {renderStars(rating, true)}
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review..."
            className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button className="mt-4 px-6 py-2 bg-black text-white rounded-md hover:bg-black/90">
            Add Review
          </button>
        </div>

        {/* Latest Reviews */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Latest</h2>
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(review.rating)}
                </div>
                <h3 className="font-semibold mb-2">{review.title}</h3>
                <p className="text-gray-600 mb-4">{review.body}</p>
                <div className="flex items-center gap-2">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-500">{review.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}