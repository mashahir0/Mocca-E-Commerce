import express from 'express'
import { registerUser,
    userLogin,
    refreshAccessToken,
    getProductDetails,
    showProductDetails,
    googleLogin,
    } from '../controller/userController.js'
import { userExistance,userStatus } from '../middleware/userMiddleware.js'
import { sendOTP,verifyOTP } from '../controller/otpController.js'
import { addReview, getReviews } from '../controller/productController.js'
import { protect } from '../middleware/authMiddleware.js'
const user_routes = express.Router()
user_routes.use(express.json())

user_routes.post('/refresh-token', refreshAccessToken);
user_routes.post('/register',userExistance,registerUser)
user_routes.post('/send-otp', sendOTP);         
user_routes.post('/verify-otp', verifyOTP);
user_routes.post('/userlogin',userStatus,userLogin)

//google login 

user_routes.post('/google-login',googleLogin)


//Product 

user_routes.get('/get-allproducts',getProductDetails)
user_routes.get('/product-info/:id',showProductDetails)

//review

user_routes.post('/product-info/:id/review',addReview)
user_routes.get('/product-info/:id/reviews',getReviews)



export default  user_routes