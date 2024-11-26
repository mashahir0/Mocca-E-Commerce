import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../services/api/adminApi'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate,Link } from 'react-router-dom'; 

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1); 
  const limit = 10; 
  const queryClient = useQueryClient(); 
  const navigate = useNavigate()

  // Fetch products
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', currentPage], 
    queryFn: () =>
      axios
        .get(`/get-products?page=${currentPage}&limit=${limit}`) 
        .then((res) => res.data), 
    keepPreviousData: true,
  });

 console.log(data);
 
  const toggleAvailabilityMutation = useMutation({
    mutationFn: (updatedProduct) =>
      axios.put(`/toggle-product/${updatedProduct._id}`, updatedProduct), 
    onMutate: () => {
     
    },
    onSuccess: () => {
      
      queryClient.invalidateQueries(['products']);
      toast.success('Product availability updated successfully!', { autoClose: 2000 });
    },
    onError: (error) => {
      
      toast.error(`Error: ${error.message}`, { autoClose: 2000 });
    },
  });

  
  const handleToggleAvailability = (productId, currentStatus) => {
    if (isLoading) {
      console.log('Products are still loading, please wait.');
      return; 
    }

    const updatedProduct = data.products.find((product) => product._id === productId);
    const updatedData = {
      ...updatedProduct,
      status: !currentStatus, 
    };

    toggleAvailabilityMutation.mutate(updatedData); 
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/edit-product/${productId}`); 
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < data.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading) return <div>Loading products...</div>;
  if (isError) return <div>Error loading products: {error.message}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
    {/* Header */}
    <div className="mb-6">
      <h1 className="text-2xl font-semibold mb-2">Products</h1>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">Home &gt; Products</div>
      </div>
    </div>
  
    {/* Products Management Table */}
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 flex justify-between items-center border-b">
        <h2 className="font-semibold">Products Management</h2>
      </div>
  
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-gray-600">Product Id</th>
              <th className="px-6 py-4 text-left text-gray-600">Product Name</th>
              <th className="px-6 py-4 text-left text-gray-600">Stock</th>
              <th className="px-6 py-4 text-left text-gray-600">Price</th>
              <th className="px-6 py-4 text-left text-gray-600">Available</th>
              <th className="px-6 py-4 text-left text-gray-600">Update</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product, index) => (
              <tr key={product._id} className="border-b last:border-b-0">
                <td className="px-6 py-4">{index + 1 + (currentPage - 1) * limit}</td>
                <td className="px-6 py-4">{product.productName}</td>
                <td className="px-6 py-4">{product.stockQuantity}</td>
                <td className="px-6 py-4">{product.salePrice}</td>
                <td className="px-6 py-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={product.status} // Use product.status instead of available
                      onChange={() =>
                        handleToggleAvailability(product._id, product.status) // Toggle the status (not available)
                      }
                      className="sr-only peer"
                    />
                    <div
                      className={`w-11 h-6 ${product.status ? 'bg-green-500' : 'bg-gray-300'} rounded-full transition-colors`}
                    >
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${
                          product.status ? 'translate-x-5' : ''
                        }`}
                      />
                    </div>
                  </label>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditProduct(product._id)}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => console.log('Delete product:', product._id)}
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  
    {/* Pagination Controls */}
    <div className="mt-4 flex justify-between items-center">
      <button
        disabled={currentPage === 1}
        onClick={handlePrevPage}
        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {data.currentPage} of {data.totalPages}
      </span>
      <button
        disabled={currentPage === data.totalPages}
        onClick={handleNextPage}
        className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  
    {/* Add New Product Button */}
    <div className="mt-6 text-right">
      <button className="p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
        <Link to="/admin/addproduct">Add New Product</Link>
      </button>
    </div>
  
    <ToastContainer />
  </div>
  
  );
}



