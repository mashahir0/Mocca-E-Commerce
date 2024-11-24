import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";


const addOrder = async (req, res) => {
    try {
        const { userId, address, products, paymentMethod, totalAmount } = req.body;

        console.log(userId);
        

        // Validate required fields
        if (!userId || !address || !products || !paymentMethod || !totalAmount) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Create a new order
        const newOrder = new Order({
            userId,
            address,
            products,
            paymentMethod,
            totalAmount,
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        // Now, update the stock quantity of the products
        for (const product of products) {
            const { productId, size, quantity } = product; // Extract productId, size, and quantity from the order

            // Find the product in the database
            const productToUpdate = await Product.findById(productId);

            // If product not found, continue to the next product
            if (!productToUpdate) {
                console.error(`Product not found: ${productId}`);
                continue;
            }

            // Find the size object for the ordered size
            const sizeToUpdate = productToUpdate.size.find(s => s.name === size);

            // If the size is not found, skip updating this product
            if (!sizeToUpdate) {
                console.error(`Size not found for product: ${productId}`);
                continue;
            }

            // Decrease the stock quantity of the ordered size
            sizeToUpdate.stock -= quantity;

            // If stock goes below 0, return an error (optional)
            if (sizeToUpdate.stock < 0) {
                console.error(`Not enough stock for size ${size} of product: ${productId}`);
                return res.status(400).json({ message: `Not enough stock for size ${size} of ${productToUpdate.productName}.` });
            }

            // Save the updated product stock to the database
            await productToUpdate.save();
        }

        // Respond with the saved order details
        res.status(201).json({ message: 'Order placed successfully.', order: savedOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order. Please try again later.' });
    }
};




const cartCheckOut = async (req, res) => {
    try {
        const { userId, address, products, paymentMethod, totalAmount } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create the new order
        const order = new Order({
            userId,
            address,
            products,
            paymentMethod,
            totalAmount,
            status: 'Pending',
            createdAt: new Date(),
        });

        // Save the order to the database
        await order.save();

        // Loop through each product and update the stock for the ordered size
        for (const item of products) {
            const product = await Product.findById(item.productId);  // Find the product by ID

            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
            }

            // Find the size object in the product's size array
            const sizeIndex = product.size.findIndex(s => s.name === item.size);

            if (sizeIndex === -1) {
                return res.status(400).json({ message: `Size ${item.size} not available for product ${item.productName}.` });
            }

            // Check if enough stock is available for the size
            if (product.size[sizeIndex].stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for size ${item.size} of ${item.productName}.` });
            }

            // Reduce the stock quantity for the ordered size
            product.size[sizeIndex].stock -= item.quantity;

            // Save the updated product
            await product.save();
        }

        // Clear the cart data for the user after placing the order
        const cart = await Cart.findOne({ userId }); // Find the cart for the user
        if (cart) {
            // If the cart exists, clear the cart items
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save(); // Save the updated cart with cleared items
        } else {
            // If no cart exists, you may want to handle this (though it should exist if the user had items in their cart)
            console.log('No cart found for the user.');
        }

        res.status(200).json({ message: 'Order placed successfully and cart cleared!' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place the order. Please try again.' });
    }
};



export {addOrder,cartCheckOut}