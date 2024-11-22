import React from 'react'
import { User, MapPin, Package, CreditCard, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopProfileNavbar() {
  return (
    <nav className="bg-white shadow-md">
  <div className="max-w-7xl mx-auto px-4">
    <div className="flex justify-center items-center h-16">
      <div className="flex items-center space-x-6">
        <Link to='/profile'><a href="#" className="flex items-center text-gray-700 hover:text-black transition-colors">
          <User className="mr-2 h-5 w-5" />
          Profile Information
        </a></Link>
        <Link to='/address-managment'><a href="#" className="flex items-center text-gray-700 hover:text-black transition-colors">
          <MapPin className="mr-2 h-5 w-5" />
          Manage Addresses
        </a></Link>
        <Link to='/orders-list'><a href="#" className="flex items-center text-gray-700 hover:text-black transition-colors">
          <Package className="mr-2 h-5 w-5" />
          My Orders
        </a></Link>
        <a href="#" className="flex items-center text-gray-700 hover:text-black transition-colors">
          <CreditCard className="mr-2 h-5 w-5" />
          My Wallet
        </a>
        <a href="#" className="flex items-center text-gray-700 hover:text-black transition-colors">
          <Mail className="mr-2 h-5 w-5" />
          Contact Us
        </a>
      </div>
    </div>
  </div>
</nav>

  )
}