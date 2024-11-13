import jwt,{decode} from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from "express-async-handler"

// const protect = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = { _id: decoded.id, role: decoded.role, email: decoded.email };
//       console.log('Decoded user:', req.user);  // Log decoded user
//       next();
//     } catch (error) {
//       console.error('JWT verification error:', error);
//       res.status(401).json({ message: 'Not authorized, token failed' });
//     }
//   } else {
//     res.status(401).json({ message: 'Not authorized, no token' });
//   }
// });
  

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        req.user = { _id: decoded.id, role: decoded.role, email: decoded.email };
        
        next();
      } catch (error) {
        console.error('JWT verification error:', error);
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  });
  
  export { protect }