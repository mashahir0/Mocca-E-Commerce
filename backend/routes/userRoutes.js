import express from 'express'
import { registerUser,
    userLogin,
    refreshAccessToken,
    } from '../controller/userController.js'
import { userExistance } from '../middleware/userMiddleware.js'
import { sendOTP,verifyOTP } from '../controller/otpController.js'
const user_routes = express.Router()
user_routes.use(express.json())

user_routes.post('/refresh-token', refreshAccessToken);
user_routes.post('/register',userExistance,registerUser)
user_routes.post('/send-otp', sendOTP);        
user_routes.post('/verify-otp', verifyOTP);
user_routes.post('/userlogin',userLogin)

export default  user_routes