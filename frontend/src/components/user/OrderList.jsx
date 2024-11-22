import React from 'react'
import { CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function OrdersList() {
    const navigate = useNavigate()
  const orders = [
    {
      id: 1,
      name: 'Printed Polyester T-shirt',
      color: 'White',
      price: 287,
      deliveryDate: 'Aug 13',
      status: 'Delivered',
      image: '/placeholder.svg?height=100&width=100'
    },
    {
      id: 2,
      name: 'Printed Polyester T-shirt',
      color: 'White',
      price: 287,
      deliveryDate: 'Aug 13',
      status: 'Delivered',
      image: '/placeholder.svg?height=100&width=100'
    }
  ]

  return (
    <>
     <div className="max-w-3xl mx-auto p-6 bg-white my-20 rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">ORDERS</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="flex items-center space-x-4 border-b pb-4"
          onClick={()=>navigate('/order-detail-view')}
          >
            <img src={order.image} alt={order.name} className="w-24 h-24 rounded-lg" />
            <div className="flex-1">
              <h3 className="font-medium">{order.name}</h3>
              <p className="text-sm text-gray-600">Colour: {order.color}</p>
              <p className="text-lg font-semibold mt-2">₹{order.price}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span>{order.status} on {order.deliveryDate}</span>
              </div>
              <p className="text-sm text-gray-500">Your item has been delivered</p>
              <button className="mt-2 px-4 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    </>
   
  )
}