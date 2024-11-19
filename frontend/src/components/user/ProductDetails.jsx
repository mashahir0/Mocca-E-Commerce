


import React, { useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../services/api/userApi';
import { useSelector } from 'react-redux';


const postReview = async ({ productId, review }) => {
  console.log(review);
  const response = await axios.post(`/product-info/${productId}/review`, review);
  return response.data;
};

const fetchReviews = async (productId) => {
  const response = await axios.get(`/product-info/${productId}/reviews`);
  return response.data; 
};

export default function ProductDetails() {

  const { user } = useSelector((state) => state.user);
  const userId = user?._id
  
  
  const { id } = useParams(); 

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await axios.get(`/product-info/${id}`);
      return response.data;
    },
  });

  const { mutate: addReview, isLoading: isSubmittingReview } = useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      queryClient.invalidateQueries(['product', id]);
    },
  });

  // Fetch reviews with react-query
const { data: reviews, isLoading: loadingReviews, error: reviewsError } = useQuery({
  queryKey: ['reviews', id], 
  queryFn: () => fetchReviews(id), 
});




  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!rating || !reviewText) {
      alert('Please provide a rating and review text!');
      return;
    }
    addReview({
      productId: id,
      review: {
        userId,
        rating,
        comment: reviewText,
      },
    });
    setRating(0);
    setReviewText('');
  };  
    
     
    
  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const {mainImage} = product
  const {thumbnails}  =product
  
  const images = [...mainImage,...thumbnails]
  

  // Render stars for product rating
  const renderStars = (rating, interactive = false) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        onClick={() => interactive && setRating(index + 1)}
        className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <Star 
          className={`h-5 w-5 ${
            index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      </button>
    ));
  }

  if (loadingReviews) {
    return <p>Loading reviews...</p>;
  }
  
  if (reviewsError) {
    return <p>Error fetching reviews: {reviewsError.message}</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {(images?.length > 0) && images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 border rounded-lg overflow-hidden ${selectedImage === index ? 'border-black' : 'border-gray-200'}`}
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
              src={images?.[selectedImage] || ""}
              alt="Selected product"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">{product.productName}</h1>
            <div className="flex items-center gap-2 mb-2">
              {renderStars(product.averageRating)}
              <span className="text-gray-500">({product.averageRating || 0} reviews)</span>
            </div>
            <p className="text-2xl font-bold">₹{product.salePrice}</p>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h2 className="font-semibold">Product Details</h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Description:</span> {product.description}</p>
              <p><span className="text-gray-600">Brand:</span> {product.brandName}</p>
              <p><span className="text-gray-600">Category:</span> {product.category}</p>
              <p><span className="text-gray-600">Net Quantity:</span> {product.stockQuantity}</p>
              <div className="space-y-1">
                <p className="text-gray-600">Sizes:</p>
                {product.size?.map((size, index) => (
                  <p key={index} className="ml-4">- {size}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <p className="font-semibold mb-2">Select Size</p>
            <div className="flex gap-2">
              {product.size?.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-full border ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'}`}
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


      <div className="max-w-4xl mx-auto p-6 space-y-8">
  {/* Product Name */}
  <h1 className="text-3xl font-bold text-gray-800">{product?.productName}</h1>

  {/* Form for adding a review */}
  <form 
    onSubmit={handleReviewSubmit} 
    className="space-y-4 p-6 border rounded-lg shadow-sm bg-white"
  >
    <h2 className="text-xl font-semibold text-gray-800">Write a Review</h2>

    {/* Star Rating */}
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`h-8 w-8 text-yellow-400 ${
            rating >= star ? 'fill-current' : 'stroke-current'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={rating >= star ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="h-full w-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
          </svg>
        </button>
      ))}
    </div>
    <p className="text-gray-600 text-sm">Your rating: {rating} star(s)</p>

    {/* Review Input */}
    <textarea
      placeholder="Share your thoughts about this product..."
      value={reviewText}
      onChange={(e) => setReviewText(e.target.value)}
      className="w-full p-4 border rounded-lg resize-none text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows={5}
    ></textarea>

    {/* Submit Button */}
    {user ? (
          <button
            type="submit"
            className="px-6 py-3 w-full font-medium text-white rounded-lg bg-black hover:bg-gray-800"
          >
            Submit Review
          </button>
        ) : (
          <p className="text-gray-600 text-sm">
            Please <a href="/login" className="text-blue-500">log in</a> to submit a review.
          </p>
        )}
  </form>
  <div className="space-y-4">
  <h2 className="text-2xl font-semibold text-gray-800">Customer Reviews</h2>
  {loadingReviews ? (
    <p>Loading reviews...</p>
  ) : reviewsError ? (
    <p>Error fetching reviews: {reviewsError.message}</p>
  ) : reviews && reviews.length > 0 ? (
    reviews.map(({ userId, rating, comment, createdAt }, index) => (
      <div key={index} className="p-4 border rounded-lg shadow-md bg-white space-y-2">
        {/* Reviewer Info */}
        <div className="flex items-center gap-2">
          {/* Display Rating Stars */}
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="font-semibold text-gray-800">{userId?.name}</span>
          <span className="text-sm text-gray-600">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
        {/* Review Comment */}
        <p className="text-gray-800">{comment}</p>
      </div>
    ))
  ) : (
    <p className="text-gray-600">No reviews yet. Be the first to review!</p>
  )}
</div>
</div>
   </div>
  );
}