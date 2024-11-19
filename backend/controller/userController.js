import User from '.././models/userModel.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Product from '../models/productModel.js'
import {OAuth2Client} from 'google-auth-library'
dotenv.config()

const key = process.env.JWT_SECRET
const refreshTokenKey = process.env.REFRESH_TOKEN

const CLIENT_ID =process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);



const googleLogin = async(req, res) => {
    const { tokenId } = req.body;  
    
    try {
       
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: CLIENT_ID, 
        });

        
        const payload = ticket.getPayload(); 
        const { sub, email, name, picture } = payload;

       
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(409).json({ message: 'Email not registered' });
        }

        if(userExist.status === false ){
            return res.status(403).json({ message: 'Your account is blocked. Please contact support.' });
        }

       
        let user = await User.findOne({ googleId: sub });
        
        
        if (!user) {
            user = await User.findOne({ email });
            user.googleId = sub;  
            user.picture = picture; 
            await user.save();
        }

        
        const accessToken = jwt.sign(
            { id: email },  
            key,          
            { expiresIn: '2d' }
        );

        const refreshToken = jwt.sign(
            { id: email }, 
            key,            
            { expiresIn: '7d' }  
        );

        
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            accessToken,
            refreshToken, 
            user,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: 'Google login failed',
            error: error.message,
        });
    }
};



const refreshAccessToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    jwt.verify(refreshToken, refreshTokenKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });

       
        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email },
            key,
            { expiresIn: '1d' }
        );

        res.json({ accessToken: newAccessToken });
    });
};


const registerUser = async (req,res)=>{
    try {
       
        const user = new User({
            name :req.body.name,
            email :req.body.email,
            phone:req.body.phone,
            password :req.body.password,
            
        })
        console.log(user);
        
        await user.save()
        return res.status(201).json({message : "User registered successfully"})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error registering user", error });
    }
}

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

       

       
        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            key,
            { expiresIn: '1d' } 
        );

        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            refreshTokenKey,
            { expiresIn: '7d' } 
        );

        
        return res.status(200).json({
            message: 'User logged in successfully',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role:user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



// const getProductDetails = async (req, res) => {
//     try {
        
        
//         // Get page and limit from query parameters, set default values
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;

//         // Calculate the number of documents to skip
//         const skip = (page - 1) * limit;

//         // Fetch products from the database with pagination
//         const products = await Product.find({ status: true })
//             .skip(skip)
//             .limit(limit)
//             .sort({ createdAt: -1 }); // Sort by newest first (optional)

        
        
        
        
           
//         // Get the total number of products
//         const totalProducts = await Product.countDocuments();
        
        
//         // Calculate the total number of pages
//         const totalPages = Math.ceil(totalProducts / limit);
        
//         // Send response
//         res.status(200).json({
//             success: true,
//             data: products,
//             pagination: {
//                 currentPage: page,
//                 totalPages,
//                 totalProducts,
//                 limit,
//             },
//         });
//     } catch (error) {
//         console.error('Error fetching product details:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// };


const getProductDetails = async (req, res) => {
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        
        const skip = (page - 1) * limit;

       
        const products = await Product.find({ status: true })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }) 
            .lean(); 

        // Calculate average rating for each product
        const productsWithRatings = products.map((product) => {
            const totalReviews = product.review.length;
            const totalRating = product.review.reduce((sum, review) => sum + (review.rating || 0), 0);
            const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : null; // Null if no reviews

            return {
                ...product,
                averageRating,
            };
        });

        
        const totalProducts = await Product.countDocuments({ status: true });

       
        const totalPages = Math.ceil(totalProducts / limit);

      
        res.status(200).json({
            success: true,
            data: productsWithRatings,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                limit,
            },
        });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


// const showProductDetails = async (req,res)=>{
    
//         try {
//           // Extract product ID from request parameters
//           const { id } = req.params;
      
//           // Fetch the product from the database
//           const product = await Product.findById(id);
      
//           // Check if product exists
//           if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//           }
      
//           // Return product data as JSON response
//           res.status(200).json(product);
//         } catch (error) {
//           console.error(error);
//           res.status(500).json({ message: 'Server error', error });
//         }
      
// }

const showProductDetails = async (req, res) => {
    try {
        
        const { id } = req.params;

        
        const product = await Product.findById(id);

       
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        
        const totalReviews = product.review.length;
        const totalRating = product.review.reduce((sum, review) => sum + (review.rating || 0), 0);
        const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : null; 

        
        res.status(200).json({
            ...product.toObject(), // Convert Mongoose document to plain object
            averageRating,        // Add average rating to the response
        });
    } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};








export {registerUser,userLogin,refreshAccessToken,getProductDetails,showProductDetails,googleLogin}