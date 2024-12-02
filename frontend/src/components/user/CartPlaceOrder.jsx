// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Minus, Plus } from 'lucide-react';
// import { useSelector } from 'react-redux';
// import axios from '../../services/api/userApi'
// import { Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';

// export default function CartPlaceOrder() {
//   const { state } = useLocation();  // Access the cart items passed from the previous page
//   const cartItems = state?.cartItems || [];

//   const {user} = useSelector((state)=>state.user)
//   const userId = user.id
 
  
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [promoCode, setPromoCode] = useState('');
//   const [address, setAddress] = useState(null);
//   const [addressErr,setAddressErr] = useState(null)
//   const [loading, setLoading] = useState(true);
//   const [couponList, setCouponList ] = useState(null)
//   const [payError, setPayError] = useState('');

//  const navigate = useNavigate()

 
 
//   const getCouponList = async()=>{
//     try {
//       const response = await axios.get('/coupon-details');
//       setCouponList(response.data);
//   } catch (error) {
//       console.error(error);
//   }
//   }


  
//   useEffect(() => {

//     const fetchDefaultAddress = async () => {
//         try {
//             const response = await axios.get(`/default-address/${userId}`);
//             setAddress(response.data);
//         } catch (err) {
//             setAddressErr(err.response?.data?.message || 'Unable to fetch address');
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchDefaultAddress();
//     getCouponList()
// }, [userId]);

//   // Calculate subtotal
//   const subtotal = cartItems.reduce((sum, item) => sum + item.productId.salePrice * item.quantity, 0);
  
//   const deliveryFee = 0;
//   const gst = 0;
//   const total = subtotal  + deliveryFee + gst;

//   const handlePlaceOrder = async () => {
//     if (!address) {
//         toast.error('Please select a delivery address.');
//         return;
//     }

//     if (!paymentMethod) {
//         setPayError('Please select a payment method before placing the order.');
//         return;
//     }

//     setPayError('');

//     const orderDetails = {
//         userId: userId,
//         address,
//         products: cartItems.map((item) => ({
//             productId: item.productId._id,  // Send the productId
//             productName: item.productId.productName,
//             mainImage: item.productId.mainImage[0],  // Assuming mainImage is an array
//             size: item.size,
//             quantity: item.quantity,
//             price: item.productId.salePrice,
//         })),
//         paymentMethod,
//         totalAmount: cartItems.reduce((sum, item) => sum + item.productId.salePrice * item.quantity, 0),  // Calculate total amount
//     };

//     try {
//         const response = await axios.post('/place-order-cart', orderDetails);
//         toast.success(response.data.message); // Success message
//         navigate('/order-confirmation'); // Redirect to order confirmation page
//     } catch (error) {
//         console.error('Error placing order:', error.response?.data?.message || error.message);
//         toast.error(error.response?.data?.message || 'Failed to place the order. Please try again.');
//     }
// };


//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Left Column */}
//         <div className="space-y-6">
//           {/* Cart Items */}
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             {cartItems.map((item) => (
//               <div key={item._id} className="flex items-center gap-4 mb-4">
//                 {/* Use productId to access the product details */}
//                 <img
//                   src={item.productId.mainImage[0]}  // Assuming mainImage is an array
//                   alt={item.productId.productName}
//                   className="w-16 h-16 object-cover rounded"
//                 />
//                 <div className="flex-1">
//                   <h3 className="font-medium">{item.productId.productName}</h3>
//                   <p className="text-gray-600">₹{item.productId.salePrice}</p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {/* <button className="p-1 hover:bg-gray-100 rounded">
//                     <Minus className="w-4 h-4" />
//                   </button> */}
//                   Quantity
//                   <span className="w-8 text-center">{item.quantity}</span>
//                   {/* <button className="p-1 hover:bg-gray-100 rounded">
//                     <Plus className="w-4 h-4" />
//                   </button> */}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <h2 className="font-semibold mb-4">Order Summary</h2>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>Rs. {subtotal}</span>
//               </div>
//               {/* <div className="flex justify-between text-red-500">
//                 <span>Discount (-10%)</span>
//                 <span>-Rs. {discount}</span>
//               </div> */}
//               <div className="flex justify-between">
//                 <span>Delivery Fee</span>
//                 <span>Rs. {deliveryFee}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Items</span>
//                 <span>{cartItems.length}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>GST</span>
//                 <span>Rs. {gst}</span>
//               </div>
//               <div className="flex justify-between font-semibold pt-2 border-t">
//                 <span>Total</span>
//                 <span>Rs. {total}</span>
//               </div>
//             </div>
//             <div className="mt-4 flex gap-2">
//               <input
//                 type="text"
//                 placeholder="Do you have a promo code?"
//                 value={promoCode}
//                 onChange={(e) => setPromoCode(e.target.value)}
//                 className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
//               />
//               <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90">
//                 Apply
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-6">
//           {/* Delivery Address */}
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-semibold">Delivery Address</h2>
              
//             </div>
//             {addressErr ? (
//     <div>Please Choose Defalt address or Add One</div>
// ) : (
//     address && (
//         <p className="text-gray-600">
//             {address.name ? `${address.name}, ` : <span>Error: Missing Name, </span>}
//             {address.houseno ? `${address.houseno}, ` : <span>Error: Missing House Number, </span>}
//             {address.landmark ? `${address.landmark}, ` : <span>Error: Missing Landmark, </span>}
//             {address.street ? `${address.street}, ` : <span>Error: Missing Street, </span>}
//             {address.town ? `${address.town}, ` : <span>Error: Missing Town, </span>}
//             {address.city ? `${address.city}, ` : <span>Error: Missing City, </span>}
//             {address.state ? `${address.state}, ` : <span>Error: Missing State, </span>}
//             {address.pincode ? `${address.pincode}, ` : <span>Error: Missing Pincode, </span>}
//             {address.phone ? `${address.phone}` : <span>Error: Missing Phone Number</span>}
//         </p>
//     )
// )}
//             <Link to='/address-managment'>
//             <button className="mt-4 w-full py-2 border rounded-md hover:bg-gray-50">
//               Change Default Address...
//             </button>
//             </Link>
//           </div>

//           {/* Payment Method */}
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <h2 className="font-semibold mb-4">Payment Method</h2>
//                 <p className="text-gray-600 mb-4">Select any payment method</p>
//                 <div className="space-y-3">
//                     {[
//                         'Razor Pay',
//                         'Wallet',
//                         'Cash On Delivery'
//                     ].map((method) => (
//                         <label key={method} className="flex items-center gap-2">
//                             <input
//                                 type="radio"
//                                 name="payment"
//                                 value={method}
//                                 checked={paymentMethod === method}
//                                 onChange={(e) => setPaymentMethod(e.target.value)}
//                                 className="w-4 h-4"
//                             />
//                             <span>{method}</span>
//                         </label>
//                     ))}
//                 </div>
//                 {payError && <p className="text-red-500 text-sm mt-2">{payError}</p>}
//                 <div className="mt-4">
//                     <p className="text-sm text-gray-600 mb-2">Accepted Payment Methods</p>
//                     <div className="flex gap-2">
//                         <img src="/placeholder.svg?height=30&width=40" alt="Visa" className="h-8" />
//                         <img src="/placeholder.svg?height=30&width=40" alt="Mastercard" className="h-8" />
//                     </div>
//                 </div>
//             </div>

//           {/* Place Order Button */}
//           <button
//             onClick={handlePlaceOrder}
//             className="w-full py-3 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
//           >
//             Place Order
//           </button>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../services/api/userApi';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

export default function CartPlaceOrder() {
  const { state } = useLocation();
  const cartItems = state?.cartItems || [];

  const { user } = useSelector((state) => state.user);
  const userId = user.id;

  const [paymentMethod, setPaymentMethod] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [address, setAddress] = useState(null);
  const [addressErr, setAddressErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponList, setCouponList] = useState([]);
  const [payError, setPayError] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isCouponValid, setIsCouponValid] = useState(true);

  const navigate = useNavigate();
  console.log(couponList);
  
  const getCouponList = async () => {
    try {
      const response = await axios.get('/coupon-details');
      setCouponList(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const response = await axios.get(`/default-address/${userId}`);
        setAddress(response.data);
      } catch (err) {
        setAddressErr(err.response?.data?.message || 'Unable to fetch address');
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultAddress();
    getCouponList();
  }, [userId]);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.productId.salePrice * item.quantity, 0);
  const deliveryFee = 0;
  const gst = 0;
  const total = subtotal + deliveryFee + gst - discountAmount; // Subtract discount from total

  // Frontend Coupon Validation
  const validateCoupon = () => {
    if (!promoCode) {
      toast.error('Please enter a promo code.');
      return false;
    }
  
    const coupon = couponList.find((c) => c.code === promoCode);
  
    if (!coupon) {
      toast.error('Invalid promo code.');
      setIsCouponValid(false);
      return false;
    }
  
    const currentDate = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validTo = new Date(coupon.validTo);
  
    if (currentDate < validFrom || currentDate > validTo) {
      toast.error('Promo code is not valid today.');
      setIsCouponValid(false);
      return false;
    }
  
    if (subtotal < coupon.minPurchaseAmount) {
      toast.error(`Minimum purchase amount is ₹${coupon.minPurchaseAmount}.`);
      setIsCouponValid(false);
      return false;
    }
  
    // Calculate the discount as a percentage of the subtotal
    const calculatedDiscount = (subtotal * coupon.discount) / 100;
  
    // Ensure the discount does not exceed the maximum allowed discount
    const discount = Math.min(calculatedDiscount, coupon.maxDiscountAmount);
  
    setDiscountAmount(discount);
    toast.success(`Promo code applied! ₹${discount.toFixed(2)} off.`);
    setIsCouponValid(true);
    return true;
  };
  

  const handleApplyCoupon = () => {
    if (validateCoupon()) {
      setIsCouponValid(true);
    } else {
      setDiscountAmount(0);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error('Please select a delivery address.');
      return;
    }

    if (!paymentMethod) {
      setPayError('Please select a payment method before placing the order.');
      return;
    }

    setPayError('');

    const orderDetails = {
      userId: userId,
      address,
      products: cartItems.map((item) => ({
        productId: item.productId._id,
        productName: item.productId.productName,
        mainImage: item.productId.mainImage[0],
        size: item.size,
        quantity: item.quantity,
        price: item.productId.salePrice,
      })),
      paymentMethod,
      totalAmount: total, // Total with discount applied
      promoCode, // Send applied promo code
      discountAmount, // Send the discount amount
    };
    try {
    if(paymentMethod === 'Razor Pay'){
      try {
        const razorpayOrderResponse = await axios.post('/create-razorpay-order', {
            amount: total,
            currency: 'INR',
        });

        const { order } = razorpayOrderResponse.data;

        const razorpayOptions = {
            key: 'rzp_test_fVyWQT9oTgFtNj',
            amount: order.amount,
            currency: order.currency,
            name: 'MOCCA',
            description: 'Order Payment',
            order_id: order.id,
            handler: async function (response) {
                const paymentVerificationResponse = await axios.post('/verify-razorpay-payment', {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                });

                if (paymentVerificationResponse.data.success) {
                    // Save order to the database
                    const orderResponse = await axios.post('/place-order', orderDetails);
                    toast.success(orderResponse.data.message);
                    navigate('/order-confirmation');
                } else {
                    toast.error('Payment verification failed.');
                }
            },
            prefill: {
                name: address.name,
                email: user.email,
                contact: address.phone,
            },
            theme: {
                color: '#F37254',
            },
        };

        const razorpayInstance = new window.Razorpay(razorpayOptions);
        razorpayInstance.open();
    } catch (error) {
        console.error('Error during Razorpay payment:', error);
        toast.error('Failed to initialize Razorpay payment.');
    }

    }else{
      try {
        const response = await axios.post('/place-order-cart', orderDetails);
      toast.success(response.data.message); 
      navigate('/order-confirmation');
        
      } catch (error) {
        console.log(error);
        
      }

    }

    
      
    } catch (error) {
      console.error('Error placing order:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Failed to place the order. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 mb-4">
                <img src={item.productId.mainImage[0]} alt={item.productId.productName} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.productId.productName}</h3>
                  <p className="text-gray-600">₹{item.productId.salePrice}</p>
                </div>
                <div className="flex items-center gap-2">
                  Quantity
                  <span className="w-8 text-center">{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Items</span>
                <span>{cartItems.length}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>Rs. {gst}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Do you have a promo code?"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none ${!isCouponValid ? 'border-red-500' : ''}`}
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90"
              >
                Apply
              </button>
            </div>

            {/* Display Discount Amount */}
            {discountAmount > 0 && (
              <div className="mt-4 text-green-500">
                <span>Discount Applied: ₹{discountAmount}</span>
              </div>
            )}

            {/* Available Coupons */}
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Available Coupons</h3>
              <ul className="space-y-2">
                {couponList.map((coupon) => (
                  <li
                    key={coupon._id}
                    className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                    onClick={() => setPromoCode(coupon.code)} // Fill code on click
                  >
                    <div>
                      <p className="font-medium">{coupon.name}</p>
                      <p className="text-xs text-gray-600">
                        {`Get ${coupon.discount}% off up to ₹${coupon.maxDiscountAmount} on orders above ₹${coupon.minPurchaseAmount}`}
                      </p>
                    </div>
                    <span className="text-sm text-black">{coupon.code}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-4">Delivery Address</h2>
            {addressErr ? (
              <div>Please choose a default address or add one.</div>
            ) : (
              address && (
                <p className="text-gray-600">{address.name}, {address.houseno}, {address.landmark}, {address.street}, {address.town}, {address.city}, {address.state}, {address.pincode}</p>
              )
            )}
            <Link to='/address-managment'>
              <button className="mt-4 w-full py-2 border rounded-md hover:bg-gray-50">Change Default Address...</button>
            </Link>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {['Razor Pay', 'Wallet', 'Cash On Delivery'].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
            {payError && <p className="text-red-500 text-sm mt-2">{payError}</p>}
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full py-3 bg-black text-white rounded-md hover:bg-black/90 transition-colors"
          >
            Place Order
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
