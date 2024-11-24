import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from '../../services/api/userApi'
import { Link } from 'react-router-dom';

export default function CartPlaceOrder() {
  const { state } = useLocation();  // Access the cart items passed from the previous page
  const cartItems = state?.cartItems || [];

  const {user} = useSelector((state)=>state.user)
  const userId = user.id
 
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [address, setAddress] = useState(null);
  const [addressErr,setAddressErr] = useState(null)
  const [loading, setLoading] = useState(true);
  const [payError, setPayError] = useState('');

 const navigate = useNavigate()
 
  


  
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
}, [userId]);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + item.productId.salePrice * item.quantity, 0);
  
  const deliveryFee = 0;
  const gst = 0;
  const total = subtotal  + deliveryFee + gst;

  const handlePlaceOrder = async () => {
    if (!address) {
        alert('Please select a delivery address.');
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
            productId: item.productId._id,  // Send the productId
            productName: item.productId.productName,
            mainImage: item.productId.mainImage[0],  // Assuming mainImage is an array
            size: item.size,
            quantity: item.quantity,
            price: item.productId.salePrice,
        })),
        paymentMethod,
        totalAmount: cartItems.reduce((sum, item) => sum + item.productId.salePrice * item.quantity, 0),  // Calculate total amount
    };

    try {
        const response = await axios.post('/place-order-cart', orderDetails);
        alert(response.data.message); // Success message
        navigate('/order-confirmation'); // Redirect to order confirmation page
    } catch (error) {
        console.error('Error placing order:', error.response?.data?.message || error.message);
        alert(error.response?.data?.message || 'Failed to place the order. Please try again.');
    }
};


  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 mb-4">
                {/* Use productId to access the product details */}
                <img
                  src={item.productId.mainImage[0]}  // Assuming mainImage is an array
                  alt={item.productId.productName}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.productId.productName}</h3>
                  <p className="text-gray-600">₹{item.productId.salePrice}</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* <button className="p-1 hover:bg-gray-100 rounded">
                    <Minus className="w-4 h-4" />
                  </button> */}
                  Quantity
                  <span className="w-8 text-center">{item.quantity}</span>
                  {/* <button className="p-1 hover:bg-gray-100 rounded">
                    <Plus className="w-4 h-4" />
                  </button> */}
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
              {/* <div className="flex justify-between text-red-500">
                <span>Discount (-10%)</span>
                <span>-Rs. {discount}</span>
              </div> */}
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
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Do you have a promo code?"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-black/90">
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Delivery Address</h2>
              
            </div>
            {addressErr ? (
    <div>Please Choose Defalt address or Add One</div>
) : (
    address && (
        <p className="text-gray-600">
            {address.name ? `${address.name}, ` : <span>Error: Missing Name, </span>}
            {address.houseno ? `${address.houseno}, ` : <span>Error: Missing House Number, </span>}
            {address.landmark ? `${address.landmark}, ` : <span>Error: Missing Landmark, </span>}
            {address.street ? `${address.street}, ` : <span>Error: Missing Street, </span>}
            {address.town ? `${address.town}, ` : <span>Error: Missing Town, </span>}
            {address.city ? `${address.city}, ` : <span>Error: Missing City, </span>}
            {address.state ? `${address.state}, ` : <span>Error: Missing State, </span>}
            {address.pincode ? `${address.pincode}, ` : <span>Error: Missing Pincode, </span>}
            {address.phone ? `${address.phone}` : <span>Error: Missing Phone Number</span>}
        </p>
    )
)}
            <Link to='/address-managment'>
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
                    {[
                        'Debit Card / Credit Card',
                        'UPI',
                        'Internet Banking',
                        'Cash On Delivery'
                    ].map((method) => (
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
                <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Accepted Payment Methods</p>
                    <div className="flex gap-2">
                        <img src="/placeholder.svg?height=30&width=40" alt="Visa" className="h-8" />
                        <img src="/placeholder.svg?height=30&width=40" alt="Mastercard" className="h-8" />
                    </div>
                </div>
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
    </div>
  );
}
