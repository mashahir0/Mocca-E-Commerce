'use client'

import { useState } from 'react'

export default function Wallet() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')

  const walletHistory = [
    {
      type: 'Purchase',
      date: '23/10/2025',
      amount: 300,
      balance: 300
    },
    {
      type: 'added to wallet',
      date: '20/10/2025',
      amount: 600,
      balance: 600
    }
  ]

  const handleAddMoney = (e) => {
    e.preventDefault()
    console.log('Adding money with:', selectedPaymentMethod)
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Details (Left Side) */}
        <div className="md:col-span-1">
          <div className="border-2 border-blue-500 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">My Balance</h2>
            <div className="text-5xl font-bold text-green-500 text-center mb-6">
              ₹ 3000
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total : ₹ 4000</span>
              <span>Today : ₹ 500</span>
            </div>
          </div>
        </div>

        {/* Add Money Section (Right Side) */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <p className="text-sm text-gray-600 mb-6">Select any payment method</p>
            
            <form onSubmit={handleAddMoney} className="space-y-6">
              <div className="space-y-3">
                {[
                  'Debit Card / Credit card',
                  'UPI Method',
                  'Internet Banking'
                ].map((method) => (
                  <label key={method} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={selectedPaymentMethod === method}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{method}</span>
                  </label>
                ))}
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg text-sm font-semibold hover:bg-black/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Add Money
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Wallet History (Bottom) */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">Wallet History</h2>
        <div className="space-y-4">
          {walletHistory.map((transaction, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="bg-black text-white px-6 py-3 text-lg font-semibold">
                {transaction.type}
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600 block mb-1">Date:</span>
                  {transaction.date}
                </div>
                <div>
                  <span className="font-medium text-gray-600 block mb-1">Amount:</span>
                  ₹ {transaction.amount}
                </div>
                <div>
                  <span className="font-medium text-gray-600 block mb-1">Balance:</span>
                  ₹ {transaction.balance}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}