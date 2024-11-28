import Coupon from "../models/couponModel.js"; 


const addCoupon = async (req, res) => {
    try {
      const {
        name,
        code,
        discount,
        minPurchaseAmount,
        maxDiscountAmount,
        validFrom,
        validTo,
        status
      } = req.body;
      console.log('111');
      
      // Create a new coupon document
      const coupon = new Coupon({
        name,
        code,
        discount,
        minPurchaseAmount,
        maxDiscountAmount,
        validFrom,
        validTo,
        visibility :status
      });
  
      // Save coupon to database
      await coupon.save();
      res.status(201).json({ message: "Coupon added successfully", coupon });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error adding coupon", error });
    }
  };

export {addCoupon}