
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from '../../services/api/axios'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({ email: '', password: '' })  // Error state for each field
  const navigate = useNavigate()

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let isValid = true
    let newErrors = { email: '', password: '' }

    // Check if email is valid
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.'
      isValid = false
    }

    // Check if password is entered
    if (formData.password.trim() === '') {
      newErrors.password = 'Password is required.'
      isValid = false
    }

    setErrors(newErrors)  // Update error state with messages
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      try {
        const response = await axios.post('/user/userlogin', formData)
        
        if (response.status === 200) {
          toast.success('Login successful!')
          navigate('/home')
        } else {
          toast.error(response.data.message || 'Login failed')
        }
      } catch (error) {
        console.log(error)

        // Handle different types of errors
        if (error.response && error.response.status === 401) {
          toast.error(error.response.data.message || 'Invalid email or password')
        } else {
          toast.error('An error occurred during login')
        }
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''  // Clear error message when user types
    }))
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">LOGIN</h1>
        <p className="text-gray-600 text-sm">
          Get access to your Orders, Wishlist and Recommendations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div className="text-right">
          <button type="button" className="text-sm text-gray-600 hover:underline">
            <Link to="/forgotpass">Forgot password?</Link>
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-black/90 transition-colors"
        >
          Sign in
        </button>

        <button
          type="button"
          className="w-full border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <img
            src="/placeholder.svg?height=20&width=20"
            alt="Google logo"
            className="w-5 h-5"
          />
          Login with Google
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <div className="text-center">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            type="button"
            className="text-black hover:underline font-semibold"
          >
            <Link to="/register">Sign Up</Link>
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}
