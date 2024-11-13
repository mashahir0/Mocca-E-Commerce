import React, { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Link ,useNavigate} from 'react-router-dom'

export default function AddProduct() {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: '',
    brandName: '',
    stockQuantity: '',
    salePrice: '',
    offerPrice: '',
    size: []
  })

  const [mainImage, setMainImage] = useState(null)
  const [thumbnails, setThumbnails] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter(s => s !== size)
        : [...prev.size, size]
    }))
  }

  const handleImageDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer?.files[0] || e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setMainImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleThumbnailAdd = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setThumbnails(prev => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    }
  }

  const removeThumbnail = (index) => {
    setThumbnails(prev => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.productName) newErrors.productName = 'Product name is required'
    if (!formData.description) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.brandName) newErrors.brandName = 'Brand name is required'
    if (!formData.stockQuantity) newErrors.stockQuantity = 'Stock quantity is required'
    if (!formData.salePrice) newErrors.salePrice = 'Sale price is required'
    if (!formData.offerPrice) newErrors.offerPrice = 'Offer price is required'
    if (formData.size.length === 0) newErrors.size = 'Please select at least one size'
    if (!mainImage) newErrors.mainImage = 'Please upload a main product image'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
        navigate('/admin/productlist')
      console.log('Form submitted:', { ...formData, mainImage, thumbnails })
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Product Details</h2>

            <div>
              <label className="block text-sm font-medium mb-2">Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product name"
              />
              {errors.productName && (
                <p className="text-red-500 text-sm mt-1">{errors.productName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter product description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter category"
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Brand Name</label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter brand name"
              />
              {errors.brandName && (
                <p className="text-red-500 text-sm mt-1">{errors.brandName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter stock quantity"
              />
              {errors.stockQuantity && (
                <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Sale Price</label>
                <input
                  type="number"
                  name="salePrice"
                  value={formData.salePrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="₹450"
                />
                {errors.salePrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.salePrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Offer Price</label>
                <input
                  type="number"
                  name="offerPrice"
                  value={formData.offerPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="₹450"
                />
                {errors.offerPrice && (
                  <p className="text-red-500 text-sm mt-1">{errors.offerPrice}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <div className="flex gap-4">
                {['S', 'M', 'L'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`w-12 h-12 rounded-full border-2 ${
                      formData.size.includes(size)
                        ? 'border-blue-500 bg-blue-50 text-blue-500'
                        : 'border-gray-300 hover:border-blue-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {errors.size && (
                <p className="text-red-500 text-sm mt-1">{errors.size}</p>
              )}
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6">Product Gallery</h2>

            {/* Main Image Upload */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleImageDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-500'
              }`}
            >
              {mainImage ? (
                <div className="relative">
                  <img
                    src={mainImage}
                    alt="Product"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setMainImage(null)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Drop your image here, or browse</p>
                  <p className="text-sm text-gray-500">jpeg, png are allowed</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageDrop}
                    className="hidden"
                    id="mainImageUpload"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('mainImageUpload').click()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Select File
                  </button>
                </div>
              )}
              {errors.mainImage && (
                <p className="text-red-500 text-sm mt-2">{errors.mainImage}</p>
              )}
            </div>

            {/* Thumbnail Images */}
            <div>
              <label className="block text-sm font-medium mb-2">Additional Images</label>
              <div className="grid grid-cols-2 gap-4">
                {thumbnails.map((thumbnail, index) => (
                  <div key={index} className="relative">
                    <img
                      src={thumbnail}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeThumbnail(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {thumbnails.length < 4 && (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailAdd}
                      className="hidden"
                      id="thumbnailUpload"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('thumbnailUpload').click()}
                      className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500"
                    >
                      <Upload className="h-6 w-6 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
           <Link to='/admin/productlist'> CANCEL</Link>
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ADD
          </button>
        </div>
      </form>
    </div>
  )
}