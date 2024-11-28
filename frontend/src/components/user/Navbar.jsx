
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Heart, ShoppingCart, User, Search } from 'lucide-react'
import { useDispatch,useSelector } from 'react-redux'
import { removeUser } from '../../redux/slice/UserSlice'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../../../utils/SearchContext'

export default function Navbar() {
  const {setSearchTerm}  = useSearch()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(removeUser());
    navigate('/login')
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value); 

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      setSearchTerm(value); 
    }, 500); 
    setTimeoutId(newTimeoutId); 
  };

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex items-center justify-between lg:justify-between">
        {/* Logo (Left) */}
        <Link to="/home" className="text-2xl font-bold">
          MOCCA
        </Link>

        {/* Navigation Links Centered on Large Screens */}
        <div className="hidden lg:flex items-center space-x-6 flex-grow justify-center">
          <Link to="/home" className="hover:text-gray-300">
            
            Home
          </Link>
          <Link to="/products" className="hover:text-gray-300">
          Products
          </Link>
          <button aria-label="Favorites" className="hover:text-gray-300">
          <Link to='/wishlist'><Heart className="h-6 w-6" /></Link>
          </button>
          <button aria-label="Cart" className="hover:text-gray-300 relative">
          <Link to='/cart'><ShoppingCart className="h-6 w-6" /></Link>
          
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </button>
          {/* Search Bar */}
          <div className="relative">
            <input
              value={input}
              type="text"
              placeholder="Search"
              className="bg-gray-800 text-white pl-3 pr-10 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-600"
              onChange={handleInputChange}
            />
            <button
              aria-label="Search"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Right Side: Icons and Logout Button */}
        <div className="hidden lg:flex items-center space-x-6">
        
          <button aria-label="User Profile" className="hover:text-gray-300">
           <Link to='/profile'> <User className="h-6 w-6" /></Link>
          </button>

          {/* Logout Button */}
          <div className="hidden lg:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.name || 'User'}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
        </div>

        {/* Hamburger Menu Button (Mobile) */}
        <button
          aria-label="Toggle Menu"
          onClick={toggleMenu}
          className="lg:hidden text-white hover:text-gray-300"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden ${isOpen ? 'block' : 'hidden'} bg-black text-white p-4`}
      >
        <Link
          to="/home"
          className="block py-2 px-4 hover:bg-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/products"
          className="block py-2 px-4 hover:bg-gray-700"
          onClick={() => setIsOpen(false)}
        >
          Products
        </Link>
        <div className="block py-2 px-4 hover:bg-gray-700">
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

        {/* Mobile Icons */}
        <div className="py-2 px-4 hover:bg-gray-700">
          <button aria-label="Favorites" className="flex items-center space-x-2">
            <Heart className="h-6 w-6" />
            <span>Wishlist</span>
          </button>
        </div>

        <div className="py-2 px-4 hover:bg-gray-700">
          <button aria-label="Cart" className="flex items-center space-x-2 relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
            <span>Cart</span>
          </button>
        </div>

        {/* Logout Button */}
        {isAuthenticated ? (
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block py-2 px-4 text-center bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="block py-2 px-4 text-center bg-blue-500 text-white rounded-full hover:bg-blue-600"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}


