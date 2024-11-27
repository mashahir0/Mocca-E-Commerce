import Product from "../models/productModel.js"; 

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



// const getProducts = async (req, res) => {
//     try {
//       const { page = 1, limit = 12 } = req.query; 
//       const pageNumber = parseInt(page, 10);
//       const limitNumber = parseInt(limit, 12);
  
      
//       const products = await Product.find()
//         .skip((pageNumber - 1) * limitNumber) 
//         .limit(limitNumber); 
  
      
//       const totalCount = await Product.countDocuments();
  
//       res.status(200).json({
//         products,
//         currentPage: pageNumber,
//         totalPages: Math.ceil(totalCount / limitNumber),
//         totalCount,
//       });
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       res.status(500).json({
//         message: "Internal Server Error",
//         error: error.message,
//       });
//     }
//   };    



//get product with filteer

const getProducts = async (req, res) => {
  
  try {
    const {
      page = 1,
      limit = 12,
      category,
      price,
      rating,
      sort,
    } = req.query;
  
    const filters = {
      status : true
    };
  
    if (category && category !== 'All') {
      filters.category = category;
    }
  
    // Price range filter
    if (price) {
      const priceRanges = price.split(',').map((range) => range.trim());
      const priceFilter = [];
      priceRanges.forEach((range) => {
        if (range === 'under-100') priceFilter.push({ salePrice: { $lt: 100 } });
        else if (range === '100-500') priceFilter.push({ salePrice: { $gte: 100, $lte: 500 } });
        else if (range === '500-1000') priceFilter.push({ salePrice: { $gte: 500, $lte: 1000 } });
        else if (range === '1000-2000') priceFilter.push({ salePrice: { $gte: 1000, $lte: 2000 } });
        else if (range === 'above-2000') priceFilter.push({ salePrice: { $gt: 2000 } });
      });
      if (priceFilter.length > 0) filters.$or = priceFilter;
    }
  
    // Sorting
    let sortOption = {};
    if (sort) {
      if (sort === 'price-asc') sortOption.salePrice = 1;
      else if (sort === 'price-desc') sortOption.salePrice = -1;
      else if (sort === 'rating-desc') sortOption.averageRating = -1;
      else if (sort === 'rating-asc') sortOption.averageRating = 1;
      else if (sort === 'alphabetical') sortOption.productName = 1;
    }
  
    // Apply a default sort if sortOption is empty
    if (Object.keys(sortOption).length === 0) {
      sortOption = { _id: 1 };
    }
  
    // Pagination
    const currentPage = parseInt(page, 10) || 1;
    const pageSize = parseInt(limit, 10) || 10;
    const skip = (currentPage - 1) * pageSize;
  
    // Aggregation pipeline
    const pipeline = [
      { $match: filters }, // Apply filters
      {
        $addFields: {
          averageRating: { $avg: "$review.rating" }, // Compute average rating dynamically
        },
      },
    ];
  
    // Apply rating filter if present
    if (rating) {
      const ratingValues = rating.split(',').map((r) => parseInt(r.trim())); 
      pipeline.push({
        $match: {
          averageRating: { $in: ratingValues }, 
        },
      });
    }
  
    // Add sorting, pagination, and limiting
    pipeline.push(
      { $sort: sortOption }, 
      { $skip: skip }, 
      { $limit: pageSize } ,
      
    );
  
    // Execute aggregation
    const products = await Product.aggregate(pipeline);
  
    // Get total product count with filters
    const totalProductsCountPipeline = [
      { $match: filters },
      {
        $addFields: {
          averageRating: { $avg: "$review.rating" }, 
        },
      },
    ];
  
  
    // Count the total products
    const totalProductsCountResult = await Product.aggregate([
      ...totalProductsCountPipeline,
      { $count: "count" },
    ]);
    const totalProductsCount =
      totalProductsCountResult.length > 0 ? totalProductsCountResult[0].count : 0;
  
    // Calculate total pages
    const totalPages = Math.ceil(totalProductsCount / pageSize);
  

    res.json({
      data: products,
      pagination: {
        currentPage,
        totalPages,
        pageSize,
        totalProducts: totalProductsCount,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

  const getProductsAdmin = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; 
      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
  
      
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
  

export { addProduct,getProducts,toggleProductAvailability,getDetailsForEdit,updateProduct,addReview,getReviews,getProductsAdmin  };
