import User from '.././models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Product from '../models/productModel.js'
import Address from '../models/addressModel.js'
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
            { expiresIn: '1h' }
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
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role:user.role,
                phone:user.phone
            }
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
                role:user.role,
                phone:user.phone
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};




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


const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id; // Extract user ID from the URL

        // Fetch the user details from the database (assuming a MongoDB database and Mongoose model)
        const user = await User.findById(userId); // Replace 'User' with your actual user model

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user details
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const updateUserProfile = async (req, res) => {
    try {
      const { name, email, phone,image } = req.body; // Extract fields from the request body
      const userId = req.params.id; // Extract user ID from route parameters

      // Check if the email exists in another user's profile
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId) {
      return res.status(409).json({ message: 'Email already exists' });
    }   
  
      if (!name || !email || !phone) {
        return res.status(400).json({ message: 'Name, email, and phone are required' });
      }
  
     
     
  
      // Update user in the database
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,
          email,
          phone,
         profileImage :image
        },
        // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Server error, please try again later' });
    }
  };
  

  const changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword.trim() !== confirmPassword.trim()) {
            return res.status(400).json({ message: 'New password and confirm password do not match' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword; // The pre('save') hook will hash the password
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error("Error during password change:", error.message);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

const changeNewPass = async (req, res) => {
    try {
        const { email, password } = req.body;
       
        
        // Step 1: Validate the input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Step 2: Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 3: Update the user's password
        user.password = password; // The `pre('save')` middleware will hash the password
        await user.save();

        // Step 4: Respond with success
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};





const addAddress = async (req, res) => {
  try {
    const { userId, name, mobile, pincode, houseNo, landmark, city, town, street, state } = req.body;

    // Validation in backend
    if (!userId || !name || !mobile || !pincode || !houseNo || !city || !state) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAddress = new Address({
      userId,
      name,
      phone : mobile,
      pincode,
      houseno :houseNo,
      landmark,
      city,
      town,
      street,
      state
    });

    await newAddress.save();
    res.status(201).json({ message: 'Address added successfully', address: newAddress });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getUserAddresses = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
      }
  
      const addresses = await Address.find({ userId });
  
    //   if (addresses.length === 0) {
    //     return res.status(404).json({ message: 'No addresses found for this user.' });
    //   }
  
      res.status(200).json(addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  const deleteAddress = async (req, res) => {
    try {
      const { addressId } = req.params;
      await Address.findByIdAndDelete(addressId);
      res.status(200).json({ message: 'Address deleted successfully!' });
    } catch (error) {
      console.error('Error deleting address:', error);
      res.status(500).json({ error: 'Failed to delete address.' });
    }
  };
  
  // Set Default Address
  const setDefaultAddress = async (req, res) => {
    try {
      const { addressId } = req.params;
      const { userId } = req.body;
  
      // Reset isDefault for all addresses
      await Address.updateMany({ userId }, { isDefault: false });
  
      // Set the selected address as default
      await Address.findByIdAndUpdate(addressId, { isDefault: true });
  
      res.status(200).json({ message: 'Default address updated successfully!' });
    } catch (error) {
      console.error('Error setting default address:', error);
      res.status(500).json({ error: 'Failed to set default address.' });
    }
  };

  const getDefaultAddress = async (req, res) => {
    try {
        const userId = req.params.id;

        // Fetch the default address for the user
        const defaultAddress = await Address.findOne({ userId, isDefault: true });

        if (!defaultAddress) {
            return res.status(404).json({ message: "Default address not found" });
        }

        res.status(200).json(defaultAddress);
    } catch (error) {
        console.error("Error fetching default address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



export {registerUser,userLogin,refreshAccessToken,getProductDetails,showProductDetails,googleLogin,
    getUserDetails,updateUserProfile,changePassword,changeNewPass,addAddress,getUserAddresses,setDefaultAddress,
    deleteAddress,getDefaultAddress
}