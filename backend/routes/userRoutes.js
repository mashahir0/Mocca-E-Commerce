import express from 'express'
import { registerUser,
    userLogin,
    refreshAccessToken,
    getProductDetails,
    showProductDetails,
    googleLogin,
    getUserDetails,
    updateUserProfile,
    changePassword,
    changeNewPass,
    addAddress,
    getUserAddresses,
    deleteAddress,
    setDefaultAddress,
    getDefaultAddress,
    } from '../controller/userController.js'
import { userExistance,userStatus } from '../middleware/userMiddleware.js'
import { sendOTP,verifyOTP } from '../controller/otpController.js'
import { addReview, getProducts, getReviews } from '../controller/productController.js'
import { protect } from '../middleware/authMiddleware.js'
import { addToCart, editQuantity, getCartInfo, removeItemFromCart } from '../controller/cartController.js'
import { addOrder, cancelOrder, cartCheckOut, createRazorpayOrder, getDetails, getOrderDetails, verifyRazorpayPayment } from '../controller/orderController.js'
import { categoriesForUser } from '../controller/categoryController.js'
import { addToWishlist, getWishListProducts, removeFromWishlist } from '../controller/wishlistController.js'
import { getCoupons, listCouponUserSide } from '../controller/couponController.js'

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

user_routes.get('/get-allproducts',getProducts)
user_routes.get('/product-info/:id',showProductDetails)

//get categoris

user_routes.get('/get-category-user',categoriesForUser)

//review

user_routes.post('/product-info/:id/review',addReview)
user_routes.get('/product-info/:id/reviews',getReviews)

//Profile 

user_routes.get('/user-details/:id',getUserDetails)
user_routes.put('/update-profile/:id',updateUserProfile)
user_routes.put('/change-password/:id',changePassword)  
user_routes.post('/change-newpassword',changeNewPass)


//address managment 

user_routes.post('/add-address',addAddress)
user_routes.get('/get-addresses/:userId',getUserAddresses)
user_routes.delete('/delete-address/:addressId', deleteAddress);
user_routes.patch('/set-default-address/:addressId', setDefaultAddress);

// cart managment 

user_routes.post('/add-to-cart',addToCart)
user_routes.get('/get-cartdetails/:id',protect,getCartInfo)
user_routes.delete('/remove-item', removeItemFromCart);
user_routes.put('/edit-quantity',editQuantity)


//order managment 

user_routes.get('/default-address/:id',getDefaultAddress)
user_routes.post('/create-razorpay-order',createRazorpayOrder)
user_routes.post('/verify-razorpay-payment',verifyRazorpayPayment)
user_routes.post('/place-order',addOrder)
user_routes.post('/place-order-cart',cartCheckOut)
user_routes.get('/order-details/:id',protect,getOrderDetails)
user_routes.get('/order-details-view/:userId/:orderId',getDetails)
user_routes.put('/cancel-order/:userId/:orderId',cancelOrder)


//wishlist 

user_routes.post('/add-wishlist/:userId/:productId',addToWishlist)
user_routes.get('/get-wishlist/:id',getWishListProducts)
user_routes.delete('/remove-from-wishlist/:userId/:productId', removeFromWishlist);

//coupon

user_routes.get('/coupon-details',listCouponUserSide)

export default  user_routes