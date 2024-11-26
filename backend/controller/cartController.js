import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
const addToCart = async (req, res) => {
    try {
      const { userId, productId, size, quantity } = req.body;
  
      if (!userId || !productId || !size || !quantity) {
        return res.status(400).json({ message: "All fields are required." });
      }
      console.log('111');
      
      
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      if (isNaN(product.salePrice)) {
        return res.status(400).json({ message: "Invalid product price." });
      }
  
      let cart = await Cart.findOne({ userId });
      console.log(cart);
      
      if (!cart) {
        cart = new Cart({
          userId,
          items: [{ productId, size, quantity }],
          totalAmount: product.salePrice * quantity, 
        });
      } else {
        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId && item.size === size
        );
  
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
        } else {
          cart.items.push({ productId, size, quantity });
        }
      }
  
      let totalAmount = 0;
      for (const item of cart.items) {
        const itemProduct = await Product.findById(item.productId);
        if (itemProduct && !isNaN(itemProduct.salePrice)) {
          totalAmount += item.quantity * itemProduct.salePrice;
        }
      }
  
      cart.totalAmount = totalAmount;
      await cart.save();
      res.status(200).json(cart);
  
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart.", error });
    }
  };
  
  const getCartInfo = async (req, res) => {
    try {
      const userId = req.params.id;
      const cart = await Cart.findOne({ userId })
        .populate({
          path: 'items.productId', 
          select: 'productName salePrice mainImage' 
        });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
     
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  const removeItemFromCart = async (req, res) => {
    try {
      const { userId, productId, size } = req.body;
  
     
      const updatedCart = await Cart.findOneAndUpdate(
        { userId, 'items.productId': productId, 'items.size': size },
        { $pull: { items: { productId, size } } },  
        { new: true }  
      );
  
      if (!updatedCart) {
        return res.status(404).json({ message: 'Cart not found or item not found' });
      }
  
     
      res.status(200).json(updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const editQuantity = async (req, res) => {
    try {
      const { userId, productId, size, quantity } = req.body;
  
     
      if (!userId || !productId || !size || typeof quantity !== 'number') {
        return res.status(400).json({ message: 'Invalid request data' });
      }
  
      if (quantity < 1 || quantity > 5) {
        return res
          .status(400)
          .json({ message: 'Quantity must be between 1 and 5' });
      }
  
      
      const cart = await Cart.findOne({ userId }).populate('items.productId');
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId._id.toString() === productId && item.size === size
      );
  
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      
      cart.items[itemIndex].quantity = quantity;
  
      
      cart.totalAmount = cart.items.reduce((sum, item) => {
        const validQuantity = item.quantity && !isNaN(item.quantity) ? item.quantity : 0;
        const validSalePrice = item.productId.salePrice && !isNaN(item.productId.salePrice)
          ? item.productId.salePrice
          : 0;
        return sum + validQuantity * validSalePrice;
      }, 0);
  
      
      await cart.save();
  
      res.status(200).json({ message: 'Quantity updated successfully', items: cart.items });
    } catch (error) {
      console.error('Error updating quantity:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
export {addToCart,getCartInfo,removeItemFromCart,editQuantity}