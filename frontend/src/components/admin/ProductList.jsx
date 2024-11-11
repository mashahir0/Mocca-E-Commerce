import React, { useState } from 'react'
import { Calendar, MoreVertical, Pencil, Trash2, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1)
  
  const products = [
    {
      id: '#25426',
      name: 'Product Name',
      stock: 100,
      date: 'Nov 8th,2023',
      available: true
    },
    {
      id: '#25425',
      name: 'Product Name',
      stock: 1000,
      date: 'Nov 7th,2023',
      available: true
    },
    {
      id: '#25424',
      name: 'Product Name',
      stock: 350,
      date: 'Nov 6th,2023',
      available: true
    },
    {
      id: '#25423',
      name: 'Product Name',
      stock: 300,
      date: 'Nov 5th,2023',
      available: true
    },
    {
      id: '#25422',
      name: 'Product Name',
      stock: 0,
      date: 'Nov 4th,2023',
      available: true
    },
    {
      id: '#25421',
      name: 'Lorem Ipsum',
      stock: 10,
      date: 'Nov 2nd,2023',
      available: true
    }
  ]

  const toggleAvailability = (productId) => {
    // Handle availability toggle
    console.log('Toggle availability for product:', productId)
  }

  const handleEdit = (productId) => {
    // Handle product edit
    console.log('Edit product:', productId)
  }

  const handleDelete = (productId) => {
    // Handle product deletion
    console.log('Delete product:', productId)
  }

  const handleAddProduct = () => {
    // Handle adding new product
    console.log('Add new product')
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Products</h1>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Home &gt; Products
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            Oct 11,2023 - Nov 11,2022
          </div>
        </div>
      </div>

      {/* Products Management Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="font-semibold">Products Management</h2>
          <button className="text-gray-600 hover:text-gray-900">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-gray-600">Product Name</th>
                <th className="px-6 py-4 text-left text-gray-600">Product Id</th>
                <th className="px-6 py-4 text-left text-gray-600">Stock</th>
                <th className="px-6 py-4 text-left text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-gray-600">Product Name</th>
                <th className="px-6 py-4 text-left text-gray-600">Available</th>
                <th className="px-6 py-4 text-left text-gray-600">Update</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b last:border-b-0">
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.id}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">{product.date}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.available}
                        onChange={() => toggleAvailability(product.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination and Add Product */}
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
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

          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
          >
            <Plus className="h-5 w-5" />
            ADD NEW PRODUCT
          </button>
        </div>
      </div>
    </div>
  )
}