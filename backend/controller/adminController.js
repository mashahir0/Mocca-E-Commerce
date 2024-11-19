import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

const key = process.env.JWT_SECRET;



const refreshTokenHandler = async (req, res) => {
  console.log('hhhhhhhhhhhhhhhh');
  
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

    const admin = await User.findById(decoded.id);
    if (!admin || admin.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ adminToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};


const adminLogin = async (req, res) => {
  try {
    const admin = await User.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(401).json({ message: "Email does not match" });
    }

    const adminPass = await bcrypt.compare(req.body.password, admin.password);
    if (!adminPass || admin.role !== "admin") {
      return res.status(401).json({ message: "Password does not match" });
    }

    const adminToken = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      key,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Login success",
      adminToken,
      adminDetails: {
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};


const getUserList = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });
    if (users && users.length > 0) {
      res.status(200).json({ users, totalCount: users.length });
    } else {
      res.status(200).json({ users: [], totalCount: 0 });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Block & Unblock

const toggleStatus = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await User.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.status = !customer.status;

    await customer.save();

    res
      .status(200)
      .json({
        message: `Customer ${
          customer.status ? "unblocked" : "blocked"
        } successfully`,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error toggling customer status" });
  }
};


//delete user 
const deleteUser = async (req, res) => {
    try {
      const userId = req.params.customerId;
      
      if (!userId) {
        return res.status(400).json({ message: "Customer ID is required" });
      }
  
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      await User.findByIdAndDelete(userId);
  
      return res.status(200).json({ message: 'User successfully deleted' });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
export { adminLogin, getUserList, toggleStatus,deleteUser,refreshTokenHandler };
