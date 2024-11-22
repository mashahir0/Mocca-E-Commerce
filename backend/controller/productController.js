import Product from "../models/productModel.js"; // Ensure the path is correct

const addProduct = async (req, res) => {
  const {
    productName,
    salePrice,
    offerPrice,
    stockQuantity,
    size,
    description,
    category,
    brandName,
    mainImage,
    thumbnails,
  } = req.body;

  try {

    const calculatedStock = size.reduce((total, s) => total + s.stock, 0);

    if (calculatedStock !== stockQuantity) {
      return res.status(400).json({
        message: "Mismatch between total stock and size stock quantities",
      });
    }

    const product = await Product.create({
      productName,
      salePrice,
      offerPrice,
      brandName,
      description,
      category,
      stockQuantity,
      size, // Now an array with size and stock
      mainImage,
      thumbnails,
    });

    res.status(200).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error.message);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const getProducts = async (req, res) => {
    try {
      const { page = 1, limit = 12 } = req.query; 
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 12);
  
      
      const products = await Product.find()
        .skip((pageNumber - 1) * limitNumber) 
        .limit(limitNumber); 
  
      
      const totalCount = await Product.countDocuments();
  
      res.status(200).json({
        products,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
        totalCount,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  };    


  const toggleProductAvailability = async (req, res) => {
    try {
        
      const { id } = req.params; 
     
      
      const { status } = req.body; 
        
        
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { status },
        { new: true } 
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({
        message: 'Product availability updated successfully',
        product: updatedProduct,
      });
    } catch (error) {
      console.error('Error updating product availability:', error);
      res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  };

  const getDetailsForEdit = async (req, res) => {
    try {
      
      const { id } = req.params;
  
      
      
      const product = await Product.findById(id);
  
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      
      res.status(200).json(product);
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  const updateProduct = async (req, res) => {
    try {
      const { 
        productName, 
        description, 
        category, 
        brandName, 
        stockQuantity, 
        salePrice, 
        offerPrice, 
        size, 
        mainImage, 
        thumbnails 
      } = req.body;
      console.log('11111111111');
      
      
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
     
      product.productName = productName || product.productName;
      product.description = description || product.description;
      product.category = category || product.category;
      product.brandName = brandName || product.brandName;
      product.stockQuantity = stockQuantity || product.stockQuantity;
      product.salePrice = salePrice || product.salePrice;
      product.offerPrice = offerPrice || product.offerPrice;
      product.size = size || product.size;
      product.mainImage = mainImage || product.mainImage;  
      product.thumbnails = thumbnails && thumbnails.length > 0 ? thumbnails : product.thumbnails;  
  
      
      await product.save();
  
      return res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
  
  const addReview = async (req, res) => {
    try {
      const { id } = req.params; 
      const { rating, comment,userId } = await req.body; 
      console.log(rating, comment,userId);
      
      
      if (!rating || isNaN(rating)) {
        return res.status(400).json({ message: "Rating must be a valid number." });
      }
  
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5." });
      }
  
      if (!comment) {
        return res.status(400).json({ message: "Comment is required." });
      }
  
      
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
      console.log(userId);
      
      
      const newReview =  {
        userId,
        rating: parseFloat(rating),
        comment,
        createdAt: new Date(),
      };
  
      product.review.push(newReview);
  
      await product.save();
  
      res.status(200).json({ message: "Review added successfully!", product });
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ message: "An error occurred while adding the review." });
    }
  };
  

  // const addReview = async (req, res) => {
  //   try {
  //     const { id } = req.params; // Product ID from URL
  //     const { rating, comment, userId } = req.body; // Review details from request body
  
  //     // Validate input
  //     if (!rating || isNaN(rating)) {
  //       return res.status(400).json({ message: "Rating must be a valid number." });
  //     }
  
  //     if (rating < 1 || rating > 5) {
  //       return res.status(400).json({ message: "Rating must be between 1 and 5." });
  //     }
  
  //     if (!comment) {
  //       return res.status(400).json({ message: "Comment is required." });
  //     }
  
  //     if (!userId) {
  //       return res.status(400).json({ message: "User ID is required." });
  //     }
  
  //     // Validate userId as a valid MongoDB ObjectId
  //     if (!mongoose.Types.ObjectId.isValid(userId)) {
  //       return res.status(400).json({ message: "Invalid User ID." });
  //     }
  
  //     // Find the product by ID
  //     const product = await Product.findById(id);
  //     if (!product) {
  //       return res.status(404).json({ message: "Product not found." });
  //     }
  
  //     // Create a new review object
  //     const newReview = {
  //       userId, // Ensure the userId is passed correctly
  //       rating: parseFloat(rating),
  //       comment,
  //       createdAt: new Date(),
  //     };
  
  //     // Add the review to the product's reviews array
  //     product.review.push(newReview);
  
  //     // Save the updated product
  //     await product.save();
  
  //     res.status(200).json({ message: "Review added successfully!", product });
  //   } catch (error) {
  //     console.error("Error adding review:", error);
  //     res.status(500).json({ message: "An error occurred while adding the review." });
  //   }
  // };


  const getReviews = async (req, res) => {
    const { id } = req.params; 
  
    try {
      
      const product = await Product.findById(id)
        .select("review") 
        .populate({
          path: "review.userId",
          select: "name", 
        });
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      res.status(200).json(product.review);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
      res.status(500).json({ message: "An error occurred while fetching reviews", error: error.message });
    }
  };
  

export { addProduct,getProducts,toggleProductAvailability,getDetailsForEdit,updateProduct,addReview,getReviews  };
