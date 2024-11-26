

import React, { useState, useEffect } from 'react';
import axios from '../../services/api/userApi';
import { Minus, Plus } from 'lucide-react';
import { useSelector ,useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate()
  

  const { user } = useSelector((state) => state.user);
  const id = user.id;

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`/get-cartdetails/${id}`);
        setCartItems(response.data.items);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cart details.');
        setLoading(false);
      }
    };
  
    fetchCartData();
  }, [id]); // Only 'id' should be in the dependency array
  
  const editQuantity = async (productId, size, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 5) {
      toast.error('Quantity must be between 1 and 5');
      return;
    }

    try {
      const response = await axios.put('/edit-quantity', {
        userId: id,
        productId,
        size,
        quantity: newQuantity,
      });

      if (response.status === 200) {
        toast.success('Quantity updated successfully');
        setCartItems(response.data.items); // Update local cart items
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (productId, size) => {
    try {
      const response = await axios.delete('/remove-item', {
        data: { userId: id, productId, size },
      });
      if (response.status === 200) {
        toast.success('Item removed from cart');
        // Update cart items locally by filtering out the removed item
        setCartItems((prevItems) =>
          prevItems.filter(
            (item) => item.productId._id !== productId || item.size !== size
          )
        );
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item from cart.');
    }
  };
  

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productId.salePrice * item.quantity,
    0
  );

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-4xl mx-auto my-28 p-4">
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item._id} className="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
            <img
              src={item.productId.mainImage}
              alt={item.productId.name}
              className="w-24 h-24 object-cover rounded-md"
            />
            <div className="flex-1">
              <h3 className="font-medium">{item.productId.name}</h3>
              <p className="text-sm text-gray-600">Size: {item.size}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm">Quantity:</span>
                <button
                  onClick={() =>
                    editQuantity(item.productId._id, item.size, item.quantity - 1)
                  }
                  className="p-1 hover:bg-gray-200 rounded"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    editQuantity(item.productId._id, item.size, item.quantity + 1)
                  }
                  className="p-1 hover:bg-gray-200 rounded"
                  disabled={item.quantity >= 5}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-lg font-semibold">₹{item.productId.salePrice}</div>
            <button
              onClick={() => removeItem(item.productId._id, item.size)}
              className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-black/90"
            >
              Remove
            </button>
          </div>
        ))}

{cartItems.length === 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={()=>navigate('/products')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            Continue Shopping
          </button>
        </div>
      )}
      </div>

      <div className="fixed top-4 right-4 mt-14 w-72 bg-white p-4 rounded-lg shadow-md border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="font-medium">
              Sub Total ({cartItems.length} item{cartItems.length > 1 ? 's' : ''})
            </div>
            <div className="text-xl font-bold">₹{subtotal}</div>
          </div>
        </div>
        <button className="w-full bg-black text-white py-2 rounded hover:bg-black/90 transition-colors"
        onClick={()=> navigate('/place-order-cart', { state: { cartItems } })}
        >
          Check Out
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
