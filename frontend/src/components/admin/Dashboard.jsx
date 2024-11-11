import React, { useState } from 'react'
import { Calendar, MoreVertical } from 'lucide-react'

export default function Dashboard() {
  const [timeframe, setTimeframe] = useState('MONTHLY')
  
  const bestProducts = [
    {
      id: 1,
      name: 'Lorem Ipsum',
      price: 126.50,
      sales: 999,
      basePrice: 126.500,
      image: '/placeholder.svg?height=50&width=50'
    },
    {
      id: 2,
      name: 'Lorem Ipsum',
      price: 126.50,
      sales: 999,
      basePrice: 126.500,
      image: '/placeholder.svg?height=50&width=50'
    },
    {
      id: 3,
      name: 'Lorem Ipsum',
      price: 126.50,
      sales: 999,
      basePrice: 126.500,
      image: '/placeholder.svg?height=50&width=50'
    }
  ]

  return (
    <div className="p-6 bg-gray-100 ">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Home &gt; Dashboard
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            Oct 11,2023 - Nov 11,2022
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Graph */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold">Sale Graph</h2>
            <div className="flex gap-2">
              {['WEEKLY', 'MONTHLY', 'YEARLY'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`px-4 py-1 rounded-full text-sm ${
                    timeframe === period
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Graph */}
          <div className="h-64 relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-600">
              <span>₹400</span>
              <span>₹300</span>
              <span>₹200</span>
              <span>₹100</span>
              <span>0</span>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-12 right-0 flex justify-between text-sm text-gray-600">
              <span>JUL</span>
              <span>AUG</span>
              <span>SEP</span>
              <span>OCT</span>
              <span>NOV</span>
              <span>DEC</span>
            </div>

            {/* Graph line (simplified representation) */}
            <div className="absolute left-12 right-0 top-0 bottom-20 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M0,90 C20,85 40,88 60,82 C80,76 90,20 100,10"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Best Products */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold">Best Products</h2>
            <button className="text-gray-600 hover:text-gray-900">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {bestProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg bg-gray-200"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-600">₹{product.basePrice}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{product.price}</p>
                  <p className="text-sm text-gray-600">{product.sales} sales</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 bg-black text-white py-2 rounded-md hover:bg-black/90 transition-colors">
            REPORT
          </button>
        </div>
      </div>
    </div>
  )
}