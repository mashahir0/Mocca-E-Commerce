


// import React, { useEffect, useState } from 'react'
// import { Edit2, Plus, Minus } from 'lucide-react'
// import { useParams } from 'react-router-dom'
// import axios from '../../services/api/userApi'
// import { useSelector } from 'react-redux'
// import { Link } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
// import { toast, ToastContainer } from 'react-toastify';

// export default function PlaceOrder() {
//     const { id, size, quantity } = useParams();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [promoCode, setPromoCode] = useState('')
//     const [paymentMethod, setPaymentMethod] = useState('')
//     const [address, setAddress] = useState(null);
//     const [addressErr,setAddressErr] = useState(null)
//     const [payError, setPayError] = useState('');
//     const [coupon ,setCoupon] = useState(null)

 

//     const navigate = useNavigate()
//     const {user} = useSelector((state)=>state.user)
//     const userId = user.id

//     const getCoupon = async()=>{
//       try {
//         const responce  = await axios.get('/coupon-details')
//         setCoupon(responce.data)
//       } catch (error) {
//         console.log(error);
        
//       }
//     }
    

//     useEffect(() => {
//         const fetchProduct = async () => {
//             try {
//                 const response = await axios.get(`/product-info/${id}`);
                
                
//                 setProduct([response.data]);
                
                
//             } catch (err) {
//                 setError(err.response?.data?.message || 'Product not found');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchProduct();

//         const fetchDefaultAddress = async () => {
//             try {
//                 const response = await axios.get(`/default-address/${userId}`);
//                 setAddress(response.data);
//             } catch (err) {
//                 setAddressErr(err.response?.data?.message || 'Unable to fetch address');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDefaultAddress();
//         getCoupon()
//     }, [id,userId]);
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;

    
  
  

//     const suntotal = product[0].salePrice * quantity
//     const total = suntotal
//     const deliveryFee = 0
//     const gst = 0
   
//     const handlePlaceOrder = async () => {
//         if (!address) {
//             toast.error('Please select a delivery address.');
//             return;
//         }
    
//         if (!paymentMethod) {
//             setPayError('Please select a payment method before placing the order.');
//             return;
//         }
    
//         setPayError('');
    
//         const orderDetails = {
//             userId: userId,
//             address,
//             products: product.map((item) => ({
//                 productId: item._id,
//                 productName: item.productName,
//                 mainImage: item.mainImage,
//                 size: size,
//                 quantity: quantity,
//                 price: item.salePrice,
//             })),
//             paymentMethod,
//             totalAmount: product.reduce((sum, item) => sum + item.salePrice * quantity, 0), // Calculate total amount
//         };
    
//         try {
//             const response = await axios.post('/place-order', orderDetails);
//             toast.success(response.data.message); // Success message
//             navigate('/order-confirmation'); // Redirect to order confirmation page
//         } catch (error) {
//             console.error('Error placing order:', error.response?.data?.message || error.message);
//             toast.error(error.response?.data?.message || 'Failed to place the order. Please try again.');
//         }
//     };

  
//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Left Column */}
//         <div className="space-y-6">
//           {/* Cart Items */}
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             {/* Render product(s) */}
// {Array.isArray(product) && product.length > 0 ? (
//     product.map((item) => (
//         <div key={item._id} className="flex items-center gap-4 mb-4">
//             <img
//                 src={item.mainImage}
//                 alt={item.productName}
//                 className="w-16 h-16 object-cover rounded"
//             />
//             <div className="flex-1">
//                 <h3 className="font-medium">{item.productName}</h3>
//                 <p className="text-gray-600">₹{item.salePrice}</p>
//                 <p className="text-gray-600">{size}</p>
//             </div>
//             <div className="flex items-center gap-2">
//                 Quantity
//                 <span className="w-8 text-center">{quantity}</span>
//             </div>
//         </div>
//     ))
// ) : product ? (
//     <div className="flex items-center gap-4 mb-4">
//         <img
//             src={product.mainImage}
//             alt={product.productName}
//             className="w-16 h-16 object-cover rounded"
//         />
//         <div className="flex-1">
//             <h3 className="font-medium">{product.productName}</h3>
//             <p className="text-gray-600">₹{product.salePrice}</p>
//             <p className="text-gray-600">{size}</p>
//         </div>
//         <div className="flex items-center gap-2">
//             Quantity
//             <span className="w-8 text-center">{quantity}</span>
//         </div>
//     </div>
// ) : (
//     <div>No product available</div>
// )}

//           </div>

//           {/* Order Summary */}
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <h2 className="font-semibold mb-4">Order Summary</h2>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>Rs. {suntotal}</span>
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
//                 <span>{quantity}</span>
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

          
//          {/* Payment Method */}
//          <div className="bg-white p-4 rounded-lg shadow-sm">
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
//   )
// }


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../services/api/userApi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

export default function PlaceOrder() {
    const { id, size, quantity } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [address, setAddress] = useState(null);
    const [addressErr, setAddressErr] = useState(null);
    const [payError, setPayError] = useState('');
    const [couponList, setCouponList] = useState([]);
    const [discountAmount, setDiscountAmount] = useState(0); // Stores the discount amount
    const [isCouponValid, setIsCouponValid] = useState(true); // Flag for coupon validity

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const userId = user.id;

    
    
    // Fetch Coupon Details
    const getCoupon = async () => {
        try {
            const response = await axios.get('/coupon-details');
            setCouponList(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch Product and Default Address
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/product-info/${id}`);
                setProduct([response.data]);
            } catch (err) {
                setError(err.response?.data?.message || 'Product not found');
            } finally {
                setLoading(false);
            }
        };

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

        fetchProduct();
        fetchDefaultAddress();
        getCoupon();
    }, [id, userId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const suntotal = product[0].salePrice * quantity;
    const total = suntotal - discountAmount; // Adjust total with discount
    const deliveryFee = 0;
    const gst = 0;

    // Validate Coupon
    const handleApplyCoupon = () => {
        const selectedCoupon = couponList.find((coupon) => coupon.code === promoCode);

        if (selectedCoupon) {
            // Calculate Discount
            if (suntotal >= selectedCoupon.minPurchaseAmount) {
                const discount = Math.min(
                    (selectedCoupon.discount / 100) * suntotal,
                    selectedCoupon.maxDiscountAmount
                );
                setDiscountAmount(discount);
                setIsCouponValid(true);
                toast.success(`Coupon applied! You saved ₹${discount.toFixed(2)}.`);
            } else {
                setIsCouponValid(false);
                toast.error(`This coupon requires a minimum purchase of ₹${selectedCoupon.minPurchaseAmount}.`);
            }
        } else {
            setIsCouponValid(false);
            toast.error('Invalid coupon code. Please try again.');
        }
    };

    // Handle Place Order
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
            userId,
            address,
            promoCode, // Include selected promo code in order details
            discountAmount, // Send the discount amount to the backend
            products: product.map((item) => ({
                productId: item._id,
                productName: item.productName,
                mainImage: item.mainImage,
                size,
                quantity,
                price: item.salePrice,
            })),
            paymentMethod,
            totalAmount: total, // Final total after discount
        };

        try {
            const response = await axios.post('/place-order', orderDetails);
            toast.success(response.data.message); // Success message
            navigate('/order-confirmation'); // Redirect to order confirmation page
        } catch (error) {
            console.error('Error placing order:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Failed to place the order. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Cart Items */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        {Array.isArray(product) && product.length > 0 ? (
                            product.map((item) => (
                                <div key={item._id} className="flex items-center gap-4 mb-4">
                                    <img
                                        src={item.mainImage}
                                        alt={item.productName}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.productName}</h3>
                                        <p className="text-gray-600">₹{item.salePrice}</p>
                                        <p className="text-gray-600">{size}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        Quantity
                                        <span className="w-8 text-center">{quantity}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div>No product available</div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rs. {suntotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span>Rs. {deliveryFee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span>{quantity}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GST</span>
                                <span>Rs. {gst}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>- Rs. {discountAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold pt-2 border-t">
                                <span>Total</span>
                                <span>Rs. {total.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            {/* Promo Code Input */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Do you have a promo code?"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className={`flex-1 px-3 py-2 border rounded-md focus:outline-none ${
                                        isCouponValid ? 'border-gray-300' : 'border-red-500'
                                    }`}
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90"
                                >
                                    Apply
                                </button>
                            </div>

                            {/* Coupon List */}
                            <div className="mt-4">
                                <h3 className="text-sm font-medium mb-2">Available Coupons</h3>
                                <ul className="space-y-2">
                                    {couponList.map((coupon) => (
                                        <li
                                            key={coupon._id}
                                            className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-100 cursor-pointer"
                                            onClick={() => setPromoCode(coupon.code)} // Set code in input field
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
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Address Section */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="font-semibold mb-4">Delivery Address</h2>
                        {address ? (
                            <div>
                                <p>{address.name}</p>
                                <p>{address.street}, {address.city}, {address.state} - {address.zip}</p>
                                <p>{address.phone}</p>
                            </div>
                        ) : (
                            <p className="text-gray-600">{addressErr}</p>
                        )}
                        <Link to="/address-management">
                            <button className="mt-4 w-full py-2 border rounded-md hover:bg-gray-50">
                                Change Default Address...
                            </button>
                        </Link>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <h2 className="font-semibold mb-4">Payment Method</h2>
                        <p className="text-gray-600 mb-4">Select any payment method</p>
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







