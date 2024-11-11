import React, { useState } from 'react'
import { Calendar, MoreVertical, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export default function UserList() {
  const [currentPage, setCurrentPage] = useState(1)
  
  const customers = [
    {
      id: '#25426',
      mobile: '000000000',
      date: 'Nov 8th,2023',
      name: 'Kevin',
      avatar: '/placeholder.svg?height=32&width=32',
      status: true
    },
    {
      id: '#25425',
      mobile: '000000000',
      date: 'Nov 7th,2023',
      name: 'Komael',
      avatar: '/placeholder.svg?height=32&width=32',
      status: true
    },
    {
      id: '#25424',
      mobile: '000000000',
      date: 'Nov 6th,2023',
      name: 'Nikhil',
      avatar: '/placeholder.svg?height=32&width=32',
      status: true
    },
    {
      id: '#25423',
      mobile: '000000000',
      date: 'Nov 5th,2023',
      name: 'Shivam',
      avatar: '/placeholder.svg?height=32&width=32',
      status: true
    },
    {
      id: '#25422',
      mobile: '000000000',
      date: 'Nov 4th,2023',
      name: 'Shadab',
      avatar: '/placeholder.svg?height=32&width=32',
      status: true
    },
    {
      id: '#25421',
      mobile: '000000000',
      date: 'Nov 2nd,2023',
      name: 'Yogesh',
      avatar: '/placeholder.svg?height=32&width=32',
      status: true
    }
  ]

  const toggleStatus = (customerId) => {
    // Handle status toggle
    console.log('Toggle status for customer:', customerId)
  }

  const handleDelete = (customerId) => {
    // Handle customer deletion
    console.log('Delete customer:', customerId)
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Customers</h1>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Home &gt; Customers
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            Oct 11,2023 - Nov 11,2022
          </div>
        </div>
      </div>

      {/* Customer Management Table */}
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
                <th className="px-6 py-4 text-left text-gray-600">Mobile</th>
                <th className="px-6 py-4 text-left text-gray-600">Customer Id</th>
                <th className="px-6 py-4 text-left text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-gray-600">Customer Name</th>
                <th className="px-6 py-4 text-left text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-gray-600">Delete</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b last:border-b-0">
                  <td className="px-6 py-4">{customer.mobile}</td>
                  <td className="px-6 py-4">{customer.id}</td>
                  <td className="px-6 py-4">{customer.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={customer.avatar}
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
                        onChange={() => toggleStatus(customer.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(customer.id)}
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
  )
}