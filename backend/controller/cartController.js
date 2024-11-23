import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
const addToCart = async (req, res) => {
    try {
      const { userId, productId, size, quantity } = req.body;
  
      if (!userId || !productId || !size || !quantity) {
        return res.status(400).json({ message: "All fields are required." });
      }
      console.log('111');
      
      // Fetch the product to get its price
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      // Check if the salePrice is a valid number
      if (isNaN(product.salePrice)) {
        return res.status(400).json({ message: "Invalid product price." });
      }
  
      // Fetch the user's cart
      let cart = await Cart.findOne({ userId });
      console.log(cart);
      
      if (!cart) {
        // If the cart doesn't exist, create a new one
        cart = new Cart({
          userId,
          items: [{ productId, size, quantity }],
          totalAmount: product.salePrice * quantity, // Ensure valid calculation
        });
      } else {
        // Check if product and size already exist in the cart
        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId && item.size === size
        );
  
        if (itemIndex > -1) {
          // Update the quantity of the existing item
          cart.items[itemIndex].quantity += quantity;
        } else {
          // Otherwise, add a new item to the cart
          cart.items.push({ productId, size, quantity });
        }
      }
  
      // Recalculate the totalAmount after adding/updating the item
      let totalAmount = 0;
      for (const item of cart.items) {
        // Fetch the price of each product and multiply by the quantity
        const itemProduct = await Product.findById(item.productId);
        if (itemProduct && !isNaN(itemProduct.salePrice)) {
          totalAmount += item.quantity * itemProduct.salePrice;
        }
      }
  
      // Set the recalculated totalAmount
      cart.totalAmount = totalAmount;
  
      // Save the cart
      await cart.save();
      res.status(200).json(cart);
  
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart.", error });
    }
  };
  
  const getCartInfo = async (req, res) => {
    try {
      // Assuming user ID is passed as a route parameter (req.params.id)
      const userId = req.params.id;
  
      // Find the cart for the user and populate product details
      const cart = await Cart.findOne({ userId })
        .populate({
          path: 'items.productId', // Field to populate
          select: 'productName salePrice mainImage' // Select specific fields from the product
        });
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Send the cart data back as a response
      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  const removeItemFromCart = async (req, res) => {
    try {
      const { userId, productId, size } = req.body; // Get userId, productId, and size from the request body
  
      // Find the cart for the user and remove the item with both productId and size
      const updatedCart = await Cart.findOneAndUpdate(
        { userId, 'items.productId': productId, 'items.size': size },
        { $pull: { items: { productId, size } } },  // Remove the item matching both productId and size
        { new: true }  // Return the updated cart
      );
  
      if (!updatedCart) {
        return res.status(404).json({ message: 'Cart not found or item not found' });
      }
  
      // Send the updated cart as the response
      res.status(200).json(updatedCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const editQuantity = async (req, res) => {
    try {
      const { userId, productId, size, quantity } = req.body;
  
      // Validate inputs
      if (!userId || !productId || !size || typeof quantity !== 'number') {
        return res.status(400).json({ message: 'Invalid request data' });
      }
  
      if (quantity < 1 || quantity > 5) {
        return res
          .status(400)
          .json({ message: 'Quantity must be between 1 and 5' });
      }
  
      // Find the user's cart
      const cart = await Cart.findOne({ userId }).populate('items.productId');
  
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
  
      // Find the specific item in the cart by productId and size
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId._id.toString() === productId && item.size === size
      );
  
      if (itemIndex === -1) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }
  
      // Update the quantity of the specific item
      cart.items[itemIndex].quantity = quantity;
  
      // Recalculate totalAmount
      cart.totalAmount = cart.items.reduce((sum, item) => {
        const validQuantity = item.quantity && !isNaN(item.quantity) ? item.quantity : 0;
        const validSalePrice = item.productId.salePrice && !isNaN(item.productId.salePrice)
          ? item.productId.salePrice
          : 0;
        return sum + validQuantity * validSalePrice;
      }, 0);
  
      // Save the cart
      await cart.save();
  
      // Return updated cart details
      res.status(200).json({ message: 'Quantity updated successfully', items: cart.items });
    } catch (error) {
      console.error('Error updating quantity:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
export {addToCart,getCartInfo,removeItemFromCart,editQuantity}