import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, User, Search } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          MOCCA
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/deals" className="hover:text-gray-300">
            Deals
          </Link>
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <button aria-label="Favorites" className="hover:text-gray-300">
            <Heart className="h-6 w-6" />
          </button>
          <button aria-label="Cart" className="hover:text-gray-300 relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </button>
          <button aria-label="User Profile" className="hover:text-gray-300">
            <User className="h-6 w-6" />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-800 text-white pl-3 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <button
              aria-label="Search"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}