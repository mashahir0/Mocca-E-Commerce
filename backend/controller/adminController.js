import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
dotenv.config()

const key = process.env.JWT_SECRET



const adminLogin = async (req, res) => {
    try {
        const admin = await User.findOne({ email: req.body.email });
        if (!admin) {
            return res.status(401).json({ message: 'Email does not match' });
        }

        const adminPass = await bcrypt.compare(req.body.password, admin.password);
        if (!adminPass ||  admin.role !== 'admin') {
            return res.status(401).json({ message: 'Password does not match' });
        }

        const adminToken = jwt.sign(
            { id: admin._id, email: admin.email,role:admin.role },
            key,
            { expiresIn: '1h' }
        );

        return res.status(201).json({
            message: 'Login success',
            adminToken,
            adminDetails: {
                name: admin.name,
                email: admin.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error });
    }
};



const getUserList = async(req, res) => {
    try {
        const users = await User.find({ role: 'user' })  // Ensure you're correctly querying for users with the 'user' role
        if (users && users.length > 0) {
            res.status(200).json({ users, totalCount: users.length })  // Send users along with total count
        } else {
            res.status(200).json({ users: [], totalCount: 0 })  // Send an empty array if no users are found
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' })  // Return a server error if any error occurs
    }
}



export {adminLogin,getUserList}