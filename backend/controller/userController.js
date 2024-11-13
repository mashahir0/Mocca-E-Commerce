import User from '.././models/userModel.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const key = process.env.JWT_SECRET
const refreshTokenKey = process.env.REFRESH_TOKEN


const refreshAccessToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    jwt.verify(refreshToken, refreshTokenKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid refresh token' });

        // Generate a new access token
        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email },
            key,
            { expiresIn: '15m' }
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
        
        // If no user is found
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate Access and Refresh tokens
        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            key,
            { expiresIn: '15m' } // Short expiry for access token
        );

        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            refreshTokenKey,
            { expiresIn: '7d' } // Longer expiry for refresh token
        );

        // Send tokens to client
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



export {registerUser,userLogin,refreshAccessToken}