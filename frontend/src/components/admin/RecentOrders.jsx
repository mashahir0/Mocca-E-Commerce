import React, { useState } from 'react'
import { MoreVertical } from 'lucide-react'

export default function RecentOrders() {
  const [selectedOrders, setSelectedOrders] = useState([])

  const orders = [
    {
      id: '#25426',
      product: 'Lorem Ipsum',
      date: 'Nov 8th,2023',
      customer: 'Kevin',
      avatar: '/placeholder.svg?height=32&width=32',
      status: 'Delivered',
      amount: '₹200.00'
    },
    {
      id: '#25425',
      product: 'Lorem Ipsum',
      date: 'Nov 7th,2023',
      customer: 'Komael',
      avatar: '/placeholder.svg?height=32&width=32',
      status: 'Cancelled',
      amount: '₹200.00'
    },
    {
      id: '#25424',
      product: 'Lorem Ipsum',
      date: 'Nov 6th,2023',
      customer: 'Nikhil',
      avatar: '/placeholder.svg?height=32&width=32',
      status: 'Delivered',
      amount: '₹200.00'
    },
    {
      id: '#25423',
      product: 'Lorem Ipsum',
      date: 'Nov 5th,2023',
      customer: 'Shivam',
      avatar: '/placeholder.svg?height=32&width=32',
      status: 'Cancelled',
      amount: '₹200.00'
    },
    {
      id: '#25422',
      product: 'Lorem Ipsum',
      date: 'Nov 4th,2023',
      customer: 'Shadab',
      avatar: '/placeholder.svg?height=32&width=32',
      status: 'Delivered',
      amount: '₹200.00'
    },
    {
      id: '#25421',
      product: 'Lorem Ipsum',
      date: 'Nov 2nd,2023',
      customer: 'Yogesh',
      avatar: '/placeholder.svg?height=32&width=32',
      status: 'Delivered',
      amount: '₹200.00'
    }
  ]

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId)
      }
      return [...prev, orderId]
    })
  }

  const toggleAllOrders = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(orders.map(order => order.id))
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 ">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-lg">Recent Orders</h2>
        <button className="text-gray-600 hover:text-gray-900">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="pb-3 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === orders.length}
                  onChange={toggleAllOrders}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="pb-3 text-left text-gray-600">Product</th>
              <th className="pb-3 text-left text-gray-600">Order ID</th>
              <th className="pb-3 text-left text-gray-600">Date</th>
              <th className="pb-3 text-left text-gray-600">Customer Name</th>
              <th className="pb-3 text-left text-gray-600">Status</th>
              <th className="pb-3 text-right text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-b-0">
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="py-4">{order.product}</td>
                <td className="py-4">{order.id}</td>
                <td className="py-4">{order.date}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={order.avatar}
                      alt={order.customer}
                      className="w-8 h-8 rounded-full"
                    />
                    {order.customer}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`w-2 h-2 rounded-full ${
                        order.status === 'Delivered' 
                          ? 'bg-green-500' 
                          : 'bg-orange-500'
                      }`}
                    />
                    {order.status}
                  </div>
                </td>
                <td className="py-4 text-right">{order.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}