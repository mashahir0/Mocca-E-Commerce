import Wallet from "../models/walletModel.js";

const getWalletDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    
    let wallet = await Wallet.findOne({ userId }).populate(
      "userId",
      "name email"
    );

    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0, transactions: [] });
      wallet = await Wallet.findOne({ userId }).populate(
        "userId",
        "name email"
      );
    }

    res.status(200).json(wallet);
  } catch (error) {
    console.error("Error fetching or creating wallet:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch or create wallet details." });
  }
};


const walletPayment = async (req, res) => {
    try {
        const { userId, totalAmount } = req.body;
        console.log(userId);
        
        if (!userId || !totalAmount) {
            return res.status(400).json({ message: 'User ID and total amount are required.' });
        }

        
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return res.status(404).json({ message: 'Wallet not found.' });
        }

        
        if (wallet.balance < totalAmount) {
            return res.status(400).json({ message: 'Not enough balance in wallet.' });
        }

        
        wallet.balance -= totalAmount;

        
        wallet.transactions.push({
            type: 'debit',
            amount: totalAmount,
            description: 'Payment for order',
        });

        await wallet.save();

        res.status(200).json({ success: true, message: 'Payment successful.' });
    } catch (error) {
        console.error('Error processing wallet payment:', error);
        res.status(500).json({ message: 'Failed to process wallet payment. Please try again later.' });
    }
};

export { getWalletDetails,walletPayment };
