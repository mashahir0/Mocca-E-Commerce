import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Wallet from "../models/walletModel.js";
import mongoose from "mongoose";
import Razorpay from 'razorpay'
import crypto from 'crypto'
import dotenv from "dotenv";
dotenv.config();

//razorpay 

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


// Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
    const { amount, currency } = req.body;

    try {
        const options = {
            amount: amount * 100, // Amount in paisa
            currency,
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, message: 'Failed to create Razorpay order' });
    }
};

// Verify Razorpay Payment

const verifyRazorpayPayment = (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  try {
    const secret = process.env.RAZORPAY_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'Razorpay Key Secret is not defined.' });
    }

    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    if (expectedSignature === razorpaySignature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully!' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed!' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error.' });
  }
};


// for buy a product 
// const addOrder = async (req, res) => {
//     try {
//         const { userId, address, products, paymentMethod, totalAmount,promoCode,discountAmount  } = req.body;

//         console.log(userId);
        
//         if (!userId || !address || !products || !paymentMethod || !totalAmount) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         const newOrder = new Order({
//             userId,
//             address,
//             products,
//             paymentMethod ,
//             paymentStatus  :paymentMethod==='Razor Pay'||paymentMethod ==='Wallet'?'Completed':'Pending',
//             totalAmount,
//             couponCode: promoCode, 
//             discountedAmount :discountAmount,
//         });

//         const savedOrder = await newOrder.save();

//         for (const product of products) {
//             const { productId, size, quantity } = product; 

//             const productToUpdate = await Product.findById(productId);

//             if (!productToUpdate) {
//                 console.error(`Product not found: ${productId}`);
//                 continue;
//             }


//             const sizeToUpdate = productToUpdate.size.find(s => s.name === size);


//             if (!sizeToUpdate) {
//                 console.error(`Size not found for product: ${productId}`);
//                 continue;
//             }


//             sizeToUpdate.stock -= quantity;


//             if (sizeToUpdate.stock < 0) {
//                 console.error(`Not enough stock for size ${size} of product: ${productId}`);
//                 return res.status(400).json({ message: `Not enough stock for size ${size} of ${productToUpdate.productName}.` });
//             }


//             await productToUpdate.save();
//         }


//         res.status(201).json({ message: 'Order placed successfully.', order: savedOrder });
//     } catch (error) {
//         console.error('Error placing order:', error);
//         res.status(500).json({ message: 'Failed to place order. Please try again later.' });
//     }
// };

// direct purchase

const addOrder = async (req, res) => {
  try {
      const { userId, address, products, paymentMethod, totalAmount, promoCode, discountAmount } = req.body;
    
    
      if (!userId || !address || !products || !paymentMethod || !totalAmount) {
          return res.status(400).json({ message: 'All fields are required.' });
      }

      
      if (paymentMethod === 'Wallet') {
          const wallet = await Wallet.findOne({ userId });

          if (!wallet || wallet.balance < totalAmount) {
              return res.status(400).json({ message: 'Not enough balance in wallet to place the order.' });
          }

          wallet.balance -= totalAmount;

          
          wallet.transactions.push({
              type: 'debit',
              amount: totalAmount,
              description: 'Payment for order',
          });

          await wallet.save();
      }

      const newOrder = new Order({
          userId,
          address,
          products,
          paymentMethod,
          paymentStatus: paymentMethod === 'Razor Pay' || paymentMethod === 'Wallet' ? 'Completed' : 'Pending',
          totalAmount,
          couponCode: promoCode,
          discountedAmount: discountAmount,
      });

      const savedOrder = await newOrder.save();

      // Deduct stock for each product in the order
      for (const product of products) {
          const { productId, size, quantity } = product;

          const productToUpdate = await Product.findById(productId);
          if (!productToUpdate) continue;

          const sizeToUpdate = productToUpdate.size.find((s) => s.name === size);
          if (sizeToUpdate) sizeToUpdate.stock -= quantity;

          if (sizeToUpdate.stock < 0) {
              return res.status(400).json({
                  message: `Not enough stock for size ${size} of ${productToUpdate.productName}.`,
              });
          }

          await productToUpdate.save();
      }

      res.status(201).json({ message: 'Order placed successfully.', order: savedOrder });
  } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Failed to place order. Please try again later.' });
  }
};



// to check out from cart 
const cartCheckOut = async (req, res) => {
  try {
    const {
      userId,
      address,
      products,
      paymentMethod,
      totalAmount,
      promoCode,
      discountAmount,
    } = req.body;
    console.log(userId);
    
    console.log('1111');
    
    console.log(paymentMethod);
    

    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    if (paymentMethod === 'Razor Pay') {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      
      const isPaymentVerified = await verifyRazorpayPayment(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isPaymentVerified) {
        return res.status(400).json({ message: 'Payment verification failed.' });
      }
    } else if (paymentMethod === 'Wallet') {
     
      if (user.walletBalance < totalAmount) {
        return res.status(400).json({ message: 'Insufficient wallet balance.' });
      }

     
      user.walletBalance -= totalAmount;
      await user.save();
    }

    
    let orderStatus = 'Processing';

    if (paymentMethod === 'Cash on Delivery') {
      orderStatus = 'Pending Payment';  
    }

    
    const order = new Order({
      userId,
      address,
      products,
      paymentMethod,
      totalAmount,
      couponCode: promoCode,
      discountedAmount: discountAmount,
      status: orderStatus,  
      createdAt: new Date(),
    });
    console.log('11111');
    
    console.log(paymentMethod);
    

    await order.save();

    
    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
      }

      const sizeIndex = product.size.findIndex((s) => s.name === item.size);
      if (sizeIndex === -1) {
        return res.status(400).json({ message: `Size ${item.size} not available for product ${item.productName}.` });
      }

      if (product.size[sizeIndex].stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for size ${item.size} of ${item.productName}.` });
      }

      product.size[sizeIndex].stock -= item.quantity;
      await product.save();
    }

    // Clear the user's cart
    const cart = await Cart.findOne({ userId });
    if (cart) {
      console.log('Cart before clearing:', cart.items); 
      cart.items = [];
      cart.totalAmount = 0;

      const updatedCart = await cart.save();  
      console.log('Updated Cart:', updatedCart); 

      res.status(200).json({ message: 'Order placed successfully and cart cleared!' });
    } else {
      console.log('No cart found for the user.');
      res.status(404).json({ message: 'Cart not found.' });
    }
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Failed to place the order. Please try again.' });
  }
};


const getOrderDetails = async (req, res) => {
    try {
      const userId= req.params.id; 
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const orders = await Order.find({ userId }) 
        .populate('products.productId', 'productName mainImage') 
        .sort({ createdAt: -1 }); 
  
      // if (!orders.length) {
      //   return res.status(404).json({ message: 'No orders found' });
      // }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  };
  
const getDetails = async(req,res)=>{
    try {
        const { userId, orderId } = req.params; 
     
        const order = await Order.findOne({ _id: orderId, userId: userId }) 
  .populate('products.productId') 
  .exec();
        
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
    
        
        return res.status(200).json(order);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
}

const cancelOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const { productId } = req.body;

    
    if (
      !mongoose.Types.ObjectId.isValid(orderId) ||
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({ message: 'Invalid Order ID, User ID, or Product ID' });
    }

    
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    
    const productInOrder = order.products.find(
      (product) => product.productId.toString() === productId
    );
    if (!productInOrder) {
      return res.status(404).json({ message: 'Product not found in order' });
    }

    if (productInOrder.status === 'Cancelled') {
      return res.status(400).json({ message: 'Product is already cancelled' });
    }

    // Update stock quantity
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    product.stockQuantity += productInOrder.quantity;

    
    if (productInOrder.size) {
      const sizeObj = product.size.find((s) => s.name === productInOrder.size);
      if (sizeObj) {
        sizeObj.stock += productInOrder.quantity;
      } else {
        return res.status(400).json({
          message: `Size '${productInOrder.size}' not found for product: ${productId}`,
        });
      }
    }
    await product.save();

    
    productInOrder.status = 'Cancelled';
    await order.save();

    
    const allProductsCancelled = order.products.every(
      (product) => product.status === 'Cancelled'
    );
    if (allProductsCancelled) {
      order.orderStatus = 'Cancelled';
      await order.save();
    }

    
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found for user.' });
    }

    const refundAmount = productInOrder.price + (order.discountedAmount || 0);

    if (order.paymentMethod === 'Cash On Delivery' && productInOrder.status === 'Delivered') {
      
      wallet.balance += refundAmount;

      wallet.transactions.push({
        type: 'credit',
        amount: refundAmount,
        description: `Refund for canceled product: ${productInOrder.productName}`,
      });
    } else if (order.paymentMethod === 'Razor Pay') {
      
      wallet.balance += refundAmount;

      wallet.transactions.push({
        type: 'credit',
        amount: refundAmount,
        description: `Refund for Razorpay canceled product: ${productInOrder.productName}`,
      });
    }

    await wallet.save();

    return res.status(200).json({
      message: 'Product canceled successfully. Refund processed.',
      order,
    });
  } catch (error) {
    console.error('Error canceling order:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


  const getAllOrders = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; 
  
      const orders = await Order.find()
        .populate('userId', 'name email') 
        .sort({ orderDate: -1 }) 
        .skip((page - 1) * limit) 
        .limit(Number(limit)); 
  
      const totalOrders = await Order.countDocuments(); 
  
      res.status(200).json({
        success: true,
        data: orders,
        currentPage: Number(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
  };



  const adminUpdateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
  
    try {
      // Validate the new status
      if (!['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(orderStatus)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
  
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
  
      // Update the order status
      order.orderStatus = orderStatus;
      if(order.orderStatus === 'Delivered'){
        order.paymentStatus = 'Completed'
      }
  
      await order.save();
      res.status(200).json({ success: true, message: 'Order status updated', data: order });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ success: false, message: 'Failed to update order status' });
    }
  };
  

  // const adminCancelOrder = async (req, res) => {
  //   const { orderId } = req.params;
  //   const { productId } = req.body;
  
  //   try {
  //     const order = await Order.findById(orderId);
  //     if (!order) {
  //       return res.status(404).json({ success: false, message: 'Order not found' });
  //     }
  
  //     const product = order.products.find(product => product.productId.toString() === productId);
  
  //     if (!product) {
  //       return res.status(404).json({ success: false, message: 'Product not found in this order' });
  //     }
  
  //     // Cancel the product
  //     product.status = 'Cancelled'; // Update the product status (you can add more details like cancellation reason if needed)
      
  //     await order.save();
  //     res.status(200).json({ success: true, message: 'Product cancelled', data: order });
  //   } catch (error) {
  //     console.error('Error cancelling product:', error);
  //     res.status(500).json({ success: false, message: 'Failed to cancel product' });
  //   }
  // };
  

  const adminCancelOrder = async (req, res) => {
    const { orderId } = req.params;
    const { productId } = req.body; 
    
    try {
     
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
  
    
      const product = order.products.find(product => product.productId.toString() === productId);
      
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found in this order' });
      }
  

      const productDetails = await Product.findById(product.productId);
      if (!productDetails) {
        return res.status(404).json({ success: false, message: 'Product details not found' });
      }
  
      const size = product.size; 
      const sizeIndex = productDetails.size.findIndex(s => s.name === size);
      
      if (sizeIndex === -1) {
        return res.status(404).json({ success: false, message: 'Size not found in product' });
      }
  

      productDetails.size[sizeIndex].stock += product.quantity; 
  
      await productDetails.save();
  

      product.status = 'Cancelled';
      await order.save(); 
  
      res.status(200).json({ success: true, message: 'Product cancelled and stock updated', data: order });
    } catch (error) {
      console.error('Error cancelling product:', error);
      res.status(500).json({ success: false, message: 'Failed to cancel product' });
    }
  };
  
  

export {addOrder,cartCheckOut,getOrderDetails,cancelOrder,getDetails,getAllOrders,adminUpdateOrderStatus,
  adminCancelOrder,createRazorpayOrder,verifyRazorpayPayment
}