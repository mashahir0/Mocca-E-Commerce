import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";



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

        // Fetch the cart and populate product data, including offerPrice and offerStatus
        const cart = await Cart.findOne({ userId }).populate({
            path: 'items.productId',
            select: 'productName salePrice mainImage category offerPrice offerStatus', // Include offerPrice and offerStatus
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Initialize variables for total amount and total discount
        let totalAmount = 0;
        let totalDiscount = 0;

        // Process each cart item
        for (const item of cart.items) {
            const product = item.productId;
            const category = await Category.findOne({ category: product.category });

            // If offerStatus is true, use the offerPrice instead of the salePrice
            let productPrice = product.salePrice; // Default price is the salePrice
            if (product.offerStatus && product.offerPrice) {
                productPrice = product.offerPrice; // Use offerPrice if offerStatus is true
            }

            // Apply discount if category status is true and offer exists
            if (category && category.status && category.offer > 0) {
                // Calculate the discount amount (discount = salePrice * offer %)
                const discount = (productPrice * category.offer) / 100;
                productPrice -= discount; // Decrease discount from productPrice
                totalDiscount += discount * item.quantity; // Sum of discount amount * quantity
            }

            // Update total amount after applying the discount
            totalAmount += productPrice * item.quantity; // Sum of final productPrice * quantity
        }

        // Prepare the response object with the calculated values
        const cartResponse = {
            ...cart.toObject(),
            totalAmount,   // Total amount after discount
            totalDiscount, // Total discount applied to the cart
            items: cart.items.map(item => ({
                ...item.toObject(),
                salePrice: item.productId.salePrice, // Reflect the updated salePrice
                offerPrice: item.productId.offerPrice, // Include the offerPrice
                offerStatus: item.productId.offerStatus, // Include the offerStatus
            })),
        };
        console.log(cartResponse);

        // Send the updated cart info back to the frontend
        res.status(200).json(cartResponse);
    } catch (error) {
        console.error("Error fetching cart info:", error);
        res.status(500).json({ message: "Server error" });
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
            return res.status(400).json({ message: 'Quantity must be between 1 and 5' });
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

        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const sizeInfo = product.size.find((s) => s.name === size);
        if (!sizeInfo) {
            return res.status(400).json({ message: `Size ${size} not available for this product.` });
        }

        
        if (quantity > sizeInfo.stock) {
            return res.status(400).json({
                message: `Cannot update quantity. Only ${sizeInfo.stock} units available for size ${size}.`,
            });
        }

        
        cart.items[itemIndex].quantity = quantity;

        // Recalculate the total amount
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