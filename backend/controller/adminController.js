import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Parser } from 'json2csv';
import pdf from 'pdfkit';
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
      { expiresIn: '1d' }
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



  const getSalesReport = async (req, res) => {
    try {
        const { filter, startDate, endDate } = req.query;
        let query = {};
        let labels = [];
        let salesData = [];

        // Handle daily filter with correct date range
        if (filter === 'daily') {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0); // Midnight of today
            const endOfDay = new Date(startOfDay);
            endOfDay.setHours(23, 59, 59, 999); // End of today

            query.orderDate = { $gte: startOfDay, $lt: endOfDay };
            labels = ['Today']; // Label for the graph
        } else if (filter === 'weekly') {
            query.orderDate = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
            const days = Array.from({ length: 7 }, (_, i) =>
                new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()
            );
            labels = days.reverse();
        } else if (filter === 'yearly') {
            query.orderDate = { $gte: new Date(new Date().getFullYear(), 0, 1) };
            labels = Array.from({ length: 12 }, (_, i) =>
                new Date(new Date().getFullYear(), i).toLocaleString('default', { month: 'short' })
            );
        } else if (startDate && endDate) {
            query.orderDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
            const days = Array.from(
                { length: (new Date(endDate) - new Date(startDate)) / (24 * 60 * 60 * 1000) + 1 },
                (_, i) =>
                    new Date(new Date(startDate).getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString()
            );
            labels = days;
        }

        // Fetch orders based on query
        const orders = await Order.find(query).populate('userId', 'name email');

        // Calculate sales data for each label
        labels.forEach((label) => {
            const filteredOrders = orders.filter((order) => {
                const orderDate = new Date(order.orderDate).toLocaleDateString();
                return orderDate === label;
            });
            const totalSalesForLabel = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
            salesData.push(totalSalesForLabel);
        });

        // Return report data
        const overallSalesCount = orders.length;
        const overallOrderAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const overallDiscount = orders.reduce((sum, order) => sum + (order.discountedAmount || 0), 0);

        const reportData = {
            overallSalesCount,
            overallOrderAmount,
            overallDiscount,
            chart: {
                labels,
                data: salesData,
            },
            orders,
        };

        res.status(200).json(reportData);
    } catch (error) {
        console.error('Error generating sales report:', error);
        res.status(500).json({ message: 'Failed to generate sales report.' });
    }
};





const downloadPDFReport = async (req, res) => {
  try {
      const { filter } = req.query;

      // Build query for today's orders
      let query = {};
      if (filter === 'daily') {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0); // Set start of the day (midnight)
          
          const todayEnd = new Date();
          todayEnd.setHours(23, 59, 59, 999); // Set end of the day (just before midnight)

          query.orderDate = { $gte: todayStart, $lte: todayEnd };
      }

      const orders = await Order.find(query);

      // If no orders found, return a message
      if (orders.length === 0) {
          res.status(200).send("No orders found for today.");
          return;
      }

      // Calculate overall metrics
      const overallSalesCount = orders.length;
      const overallOrderAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const overallDiscount = orders.reduce((sum, order) => sum + (order.discountedAmount || 0), 0);

      // Create PDF document
      const doc = new pdf();
      res.setHeader('Content-Disposition', 'attachment; filename="daily_sales_report.pdf"');
      res.setHeader('Content-Type', 'application/pdf');
      doc.pipe(res);

      // Add title and overall metrics
      doc.fontSize(18).text('Daily Sales Report', { align: 'center' });
      doc.text(`Overall Sales Count: ${overallSalesCount}`, { align: 'left' });
      doc.text(`Overall Order Amount: ₹${overallOrderAmount.toFixed(2)}`, { align: 'left' });
      doc.text(`Overall Discount: ₹${overallDiscount.toFixed(2)}`, { align: 'left' });

      // Add details for each order
      orders.forEach((order, idx) => {
          doc.fontSize(12).text(`Order #${idx + 1}: ${order._id}`);
          doc.text(`Total Amount: ₹${order.totalAmount}`);
          doc.text(`Discount: ₹${order.discountedAmount || 0}`);
          doc.text('---');
      });

      doc.end();
  } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ message: 'Failed to generate PDF.' });
  }
};




const downloadExcelReport = async (req, res) => {
  try {
      const { filter } = req.query;

      // Build query for today's orders
      let query = {};
      if (filter === 'daily') {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0); // Set start of the day (midnight)
          
          const todayEnd = new Date();
          todayEnd.setHours(23, 59, 59, 999); // Set end of the day (just before midnight)

          query.orderDate = { $gte: todayStart, $lte: todayEnd };
      }

      const orders = await Order.find(query);

      // If no orders found, return a message
      if (orders.length === 0) {
          res.status(200).send("No orders found for today.");
          return;
      }

      // Calculate overall metrics
      const overallSalesCount = orders.length;
      const overallOrderAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const overallDiscount = orders.reduce((sum, order) => sum + (order.discountedAmount || 0), 0);

      // Prepare data for CSV
      const fields = ['Order ID', 'User', 'Total Amount', 'Discount', 'Date'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(
          orders.map((order) => ({
              'Order ID': order._id,
              User: order.userId ? order.userId.name : 'N/A',  // Ensure userId exists
              'Total Amount': order.totalAmount,
              Discount: order.discountedAmount || 0,
              Date: order.orderDate.toISOString().split('T')[0],
          }))
      );

      // Add overall metrics at the top of the CSV
      const overallData = `Overall Sales Count: ${overallSalesCount}\nOverall Order Amount: ₹${overallOrderAmount.toFixed(2)}\nOverall Discount: ₹${overallDiscount.toFixed(2)}\n\n`;

      res.setHeader('Content-Disposition', 'attachment; filename="daily_sales_report.csv"');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(overallData + csv);
  } catch (error) {
      console.error('Error generating Excel report:', error);
      res.status(500).json({ message: 'Failed to generate Excel report.' });
  }
};



  
export { adminLogin, getUserList, toggleStatus,deleteUser,refreshTokenHandler,
  getSalesReport,downloadExcelReport,downloadPDFReport };
