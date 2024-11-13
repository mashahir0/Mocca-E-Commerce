import React, { useEffect, useState } from 'react'
import { Calendar, MoreVertical, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import axios from '../../services/api/adminApi'

export default function UserList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [customers, setCustomers] = useState([]) // state to hold the customer data
  const [totalCustomers, setTotalCustomers] = useState(0) // to store the total customers count (for pagination)
  const [showModal, setShowModal] = useState(false) // state to control modal visibility
  const [selectedCustomer, setSelectedCustomer] = useState(null) // state to hold selected customer for deletion

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/userlist', {
          params: { page: currentPage }
        })
        if (response.status === 200) {
          setCustomers(response.data.users || [])
          setTotalCustomers(response.data.totalCount || 0)
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchData()
  }, [currentPage])

  const toggleStatus = (customerId) => {
    console.log('Toggle status for customer:', customerId)
  }

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer)
    setShowModal(true) 
  }

  const confirmDelete = async () => {
    if (selectedCustomer) {
      try {
        await axios.delete(`/admin/deleteUser/${selectedCustomer._id}`)
        setCustomers(customers.filter(cust => cust._id !== selectedCustomer._id))
        setShowModal(false)
        setSelectedCustomer(null)
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  const cancelDelete = () => {
    setShowModal(false)
    setSelectedCustomer(null)
  }

  const customersPerPage = 5

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Customers</h1>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Home &gt; Customers
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            Oct 11,2023 - Nov 11,2023
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="font-semibold">Customer Management</h2>
          <button className="text-gray-600 hover:text-gray-900">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-4 text-left text-gray-600">Customer Id</th>
                <th className="px-6 py-4 text-left text-gray-600">Mobile</th>
                <th className="px-6 py-4 text-left text-gray-600">Email</th>
                <th className="px-6 py-4 text-left text-gray-600">Customer Name</th>
                <th className="px-6 py-4 text-left text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-gray-600">Delete</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(customers) && customers.map((customer, index) => (
                <tr key={customer._id} className="border-b last:border-b-0">
                  <td className="px-6 py-4">{(currentPage - 1) * customersPerPage + index + 1}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        alt={customer.name}
                        className="w-8 h-8 rounded-full"
                      />
                      {customer.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customer.status}
                        onChange={() => toggleStatus(customer._id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteClick(customer)}
                      className="text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {[...Array(Math.ceil(totalCustomers / customersPerPage))].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage === Math.ceil(totalCustomers / customersPerPage)}
            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Modal for Deletion Confirmation */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete {selectedCustomer?.name}?</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
