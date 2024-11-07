import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from  '../../services/api/axios'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function UserReg() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  })
  
  const navigate = useNavigate()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [timer, setTimer] = useState(15)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSendOTP = () => {
    setOtpSent(true)
    setIsTimerRunning(true)
    setTimer(15)
    // Add your OTP sending logic here
    console.log('Sending OTP to:', formData.email)
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
   try {
      const responce = await axios.post('/user/register',formData)
      if(responce.status ===201){
        navigate('/login')
        toast("Wow so easy!");
      }else{
        toast("User already exist!");
      }
   } catch (error) {
    console.log(error);
    
   }
  }

  useEffect(() => {
    let interval
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else if (timer === 0) {
      setIsTimerRunning(false)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timer])

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">LOOKS LIKE YOU'RE NEW HERE!</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div className="grid grid-cols-2 gap-4"> */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
            required
          />
        {/* </div> */}
          <input
            type="text"
            name="phone"
            placeholder="Phone No"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
            required
          />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          required
        />

        <div className="relative">
          <input
            type="text"
            name="otp"
            placeholder="OTP"
            value={formData.otp}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <button
            type="button"
            onClick={handleSendOTP}
            disabled={isTimerRunning}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800"
          >
            {otpSent ? `Resend OTP ${timer > 0 ? `(${timer}s)` : ''}` : 'Send OTP'}
          </button>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-black/90 transition-colors"
        >
          Sign Up
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
          Register with google
        </button>

        <div className="text-center mt-6">
          <span className="text-gray-600">Have an account? </span>
          <button
            type="button"
            className="text-black hover:underline font-semibold"
          >
             <Link to="/login">Sign Up</Link>
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}