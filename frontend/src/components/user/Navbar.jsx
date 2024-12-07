


import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { Menu, X, Heart, ShoppingCart, User, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { removeUser } from '../../redux/slice/UserSlice';
import axios from '../../services/api/userApi';
import { useSearch } from '../../../utils/SearchContext';

export default function Navbar() {
  const { setSearchTerm } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(removeUser());
    navigate('/login');
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setInput(value);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      setSearchTerm(value);
    }, 500);
    setTimeoutId(newTimeoutId);

    if (value.trim() === '') {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    try {
      const response = await axios.get(`/search-suggestions?q=${value}`);
      setSuggestions(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(`/productinfo/${suggestion._id}`);
    setInput('');
    setShowDropdown(false);
  };

  return (
    <nav className="bg-black text-white p-4">
      <div className="container mx-auto flex items-center justify-between lg:justify-between">
        <Link to="/home" className="text-2xl font-bold">
          MOCCA
        </Link>

        <div className="hidden lg:flex items-center space-x-6 flex-grow justify-center">
          <Link to="/home" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/products" className="hover:text-gray-300">
            Products
          </Link>
          <button aria-label="Favorites" className="hover:text-gray-300">
            <Link to="/wishlist">
              <Heart className="h-6 w-6" />
            </Link>
          </button>
          <button aria-label="Cart" className="hover:text-gray-300 relative">
            <Link to="/cart">
              <ShoppingCart className="h-6 w-6" />
            </Link>
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </button>

          {/* Search Bar with Dropdown */}
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

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && location.pathname !== '/products' && (
              <ul className="absolute bg-white text-black rounded shadow-lg w-full mt-2 z-10">
                {suggestions.slice(0, 4).map((suggestion) => (
                  <li
                    key={suggestion._id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center">
                      <img
                        src={suggestion.mainImage}
                        alt={suggestion.productName}
                        className="h-10 w-10 rounded mr-2"
                      />
                      <div>
                        <p className="font-medium">{suggestion.productName}</p>
                        {/* <p className="text-sm text-gray-500">₹{suggestion.salePrice}</p> */}
                      </div>
                    </div>
                  </li>
                ))}
                {suggestions.length > 4 && (
                  <li
                    className="p-2 hover:bg-gray-200 cursor-pointer text-blue-500 font-medium"
                    onClick={() => navigate('/products')}
                  >
                    See All Products
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-6">
          <button aria-label="User Profile" className="hover:text-gray-300">
            <Link to="/profile">
              <User className="h-6 w-6" />
            </Link>
          </button>

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

        <button
          aria-label="Toggle Menu"
          onClick={toggleMenu}
          className="lg:hidden text-white hover:text-gray-300"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </nav>
  );
}
