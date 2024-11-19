

import React, { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../services/api/adminApi';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { uploadToCloudinary } from '../../services/cloudinary/Cloudinary';

export default function EditProduct() {
  const { id } = useParams(); // forr fetching the product by id
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    brandName: '',
    stockQuantity: '',
    salePrice: '',
    offerPrice: '',
    size: [],
  });

  const [mainImage, setMainImage] = useState(null);
  const [thumbnails, setThumbnails] = useState([null, null, null]);
  const [croppedImages, setCroppedImages] = useState({ main: null, thumbnails: [null, null, null] });
  const [isCropping, setIsCropping] = useState(false);
  const [imageBeingCropped, setImageBeingCropped] = useState(null); 
  const [errors, setErrors] = useState({});
  const cropperRefs = useRef([null, null, null, null]);

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('/list-category');
      return response.data;
    },
  });

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`/edit-product-details/${id}`);
        const { productName, description, category, brandName, stockQuantity, salePrice, offerPrice, size, mainImage, thumbnails } = response.data;
        setFormData({ productName, description, category, brandName, stockQuantity, salePrice, offerPrice, size });
        setMainImage(mainImage);
        setThumbnails(thumbnails || [null, null, null]);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
        navigate('/admin/productlist'); 
      }
    }
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageDrop = (e, type) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'main') {
          setMainImage(reader.result); // Set preview for main image
          setImageBeingCropped('main');
          setIsCropping(true);
        } else {
          const updatedThumbnails = [...thumbnails];
          const index = type === 'thumbnail1' ? 0 : type === 'thumbnail2' ? 1 : 2;
          updatedThumbnails[index] = reader.result; // Set preview for thumbnail
          setThumbnails(updatedThumbnails);
          setImageBeingCropped(`thumbnail${index + 1}`);
          setIsCropping(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async () => {
    const cropperInstance =
      cropperRefs.current[imageBeingCropped === 'main' ? 0 : parseInt(imageBeingCropped.replace('thumbnail', ''))];
  
    if (cropperInstance) {
      const croppedCanvas = cropperInstance.getCroppedCanvas();
      const cropped = croppedCanvas ? croppedCanvas.toDataURL() : null;
  
      // Upload to Cloudinary after cropping
      try {
        if (imageBeingCropped === 'main') {
          const mainImageUrl = await uploadToCloudinary(cropped);
          setCroppedImages((prev) => ({ ...prev, main: mainImageUrl }));
          setMainImage(mainImageUrl);
        } else {
          const updatedCroppedThumbnails = [...croppedImages.thumbnails];
          const index = parseInt(imageBeingCropped.replace('thumbnail', '')) - 1;
          updatedCroppedThumbnails[index] = cropped;
          setCroppedImages((prev) => ({ ...prev, thumbnails: updatedCroppedThumbnails }));
  
          const updatedThumbnails = [...thumbnails];
          updatedThumbnails[index] = cropped;
          setThumbnails(updatedThumbnails);
        }
  
        setIsCropping(false); // Hide cropper after cropping is done
      } catch (error) {
        console.error('Failed to upload cropped image:', error);
      }
    }
  };

  const handleRemoveImage = (type) => {
    if (type === 'main') {
      setMainImage(null); // Clear main image
      setCroppedImages((prev) => ({ ...prev, main: null }));
    } else {
      const updatedThumbnails = [...thumbnails];
      const index = type === 'thumbnail1' ? 0 : type === 'thumbnail2' ? 1 : 2;
      updatedThumbnails[index] = null; // Clear the selected thumbnail image
      setThumbnails(updatedThumbnails);
      const updatedCroppedThumbnails = [...croppedImages.thumbnails];
      updatedCroppedThumbnails[index] = null; // Clear cropped thumbnail
      setCroppedImages((prev) => ({ ...prev, thumbnails: updatedCroppedThumbnails }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName) newErrors.productName = 'Product name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.brandName) newErrors.brandName = 'Brand name is required';
    if (!formData.stockQuantity) newErrors.stockQuantity = 'Stock quantity is required';
    if (!formData.salePrice) newErrors.salePrice = 'Sale price is required';
    if (!formData.offerPrice) newErrors.offerPrice = 'Offer price is required';
    if (formData.size.length === 0) newErrors.size = 'Please select at least one size';
    if (!mainImage) newErrors.mainImage = 'Main image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Upload main image and thumbnails to Cloudinary
        const mainImageUrl = await uploadToCloudinary(mainImage);
        const thumbnailsUrls = await Promise.all(
          thumbnails.map((thumbnail) => (thumbnail ? uploadToCloudinary(thumbnail) : null))
        );
        
        const updatedProductData = {
          ...formData,
          mainImage: mainImageUrl,
          thumbnails: thumbnailsUrls,
        };
        
  
        await axios.put(`/update-product/${id}`, updatedProductData);
        navigate('/admin/productlist');
      } catch (error) {
        console.error('Failed to update product:', error);
      }
    }
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      let newSize = [...prev.size];
      if (checked) {
        // Add size to the array if it's checked
        newSize.push(value);
      } else {
        // Remove size from the array if it's unchecked
        newSize = newSize.filter((size) => size !== value);
      }
      return { ...prev, size: newSize };
    });
  
    if (errors.size) {
      setErrors((prev) => ({ ...prev, size: '' }));
    }
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Product Details */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Product Details</h2>
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              />
              {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border rounded-md"
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Price and Stock Quantity */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Sale Price</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                />
                {errors.salePrice && <p className="text-red-500 text-sm mt-1">{errors.salePrice}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Offer Price</label>
                <input
                  type="number"
                  name="offerPrice"
                  value={formData.offerPrice}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md"
                />
                {errors.offerPrice && <p className="text-red-500 text-sm mt-1">{errors.offerPrice}</p>}
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
              />
              {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>}
            </div>

            {/* Sizes */}
            <div>
  <label className="block text-sm font-medium mb-2">Sizes</label>
  <div className="space-y-2">
    {['S', 'M', 'L', 'XL'].map((sizeOption) => (
      <div key={sizeOption} className="flex items-center">
        <input
          type="checkbox"
          id={sizeOption}
          name="size"
          value={sizeOption}
          checked={formData.size.includes(sizeOption)}  // Check if the size is selected
          onChange={(e) => handleSizeChange(e)}  // Update size field on change
          className="h-4 w-4 border-gray-300 rounded"
        />
        <label htmlFor={sizeOption} className="ml-2 text-sm">{sizeOption}</label>
      </div>
    ))}
  </div>
  {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
</div>

          </div>

          {/* Right Column - Image Upload */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Images</h2>

            {/* Main Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Main Image</label>
              <div
                className="w-full p-3 border rounded-md"
                onDrop={(e) => handleImageDrop(e, 'main')}
                onDragOver={(e) => e.preventDefault()}
              >
                {mainImage ? (
                  <>
                    <img
                      src={mainImage}
                      alt="Main Preview"
                      className="object-cover w-full h-64"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage('main')}
                      className=" top-2 right-2 bg-red-500 text-white rounded-full"
                    >
                      <X />
                    </button>
                  </>
                ) : (
                  <p>Drop or select main image here</p>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {thumbnails.map((thumbnail, index) => (
              <div key={index} className="mb-6">
                <label className="block text-sm font-medium mb-2">{`Thumbnail ${index + 1}`}</label>
                <div
                  className="w-full p-3 border rounded-md"
                  onDrop={(e) => handleImageDrop(e, `thumbnail${index + 1}`)}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {thumbnail ? (
                    <>
                     <button
                        type="button"
                        onClick={() => handleRemoveImage(`thumbnail${index + 1}`)}
                        className=" top-2 right-2 bg-red-500 text-white rounded-full"
                      >
                        <X />
                      </button>
                      <img
                        src={thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        className="object-cover w-full h-24"
                      />
                     
                    </>
                  ) : (
                    <p>Drop or select thumbnail {index + 1} here</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
}
