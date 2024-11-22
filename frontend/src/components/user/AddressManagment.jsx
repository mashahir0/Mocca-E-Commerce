import React from 'react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AddressManagment() {
  return (
    <>
   
    <div className="max-w-lg mx-auto p-6 bg-white  my-9 rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-6">Address Information</h2>
      <Link to='/add-address'>
      <button className="w-full flex items-center justify-center px-4 py-3 border rounded-lg text-gray-700 hover:bg-gray-100 transition-colors mb-6">
        <Plus className="mr-2 h-5 w-5" />
       Add a new address
        
      </button>
      </Link>
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">Default Address</h3>
        <p className="text-sm mb-1"><strong>Mashahir</strong> 9072811675</p>
        <p className="text-sm text-gray-600 mb-4">
          thadukkassery palakkad kerala, kongad, kerala, 678613, India
        </p>
        <div className="flex space-x-4">
            <Link to='/edit-address'><button className="text-sm text-blue-500 hover:underline">Edit Address</button></Link>
          
          <button className="text-sm text-red-500 hover:underline">Delete Address</button>
        </div>
      </div>
    </div>
    </>
    
  )
}