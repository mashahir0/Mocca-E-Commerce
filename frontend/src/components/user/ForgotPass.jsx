import React, { useState, useEffect } from 'react'

export default function ForgotPass() {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  })
  
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add your form submission logic here
    console.log('Form submitted:', formData)
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
        <h1 className="text-2xl font-bold mb-2">FORGOT PASSWORD ?</h1>
        <p className="text-gray-600 text-sm">
          Don't worry Enter your appropriate email or phone number we will send you a OTP to change password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
            required
          />
          <button
            type="button"
            onClick={handleSendOTP}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-blue-600 hover:text-blue-800"
          >
            Send OTP
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            name="otp"
            placeholder="OTP"
            value={formData.otp}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isTimerRunning && <span className="text-sm text-gray-500">{timer}s</span>}
            {(!isTimerRunning && otpSent) && (
              <button
                type="button"
                onClick={handleSendOTP}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Resend OTP
              </button>
            )}
          </div>
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
          Change Password
        </button>

        <div className="text-center mt-6">
          <span className="text-gray-600">Don't have an account? </span>
          <button
            type="button"
            className="bg-black text-white px-4 py-1 rounded-md hover:bg-black/90 transition-colors text-sm"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}