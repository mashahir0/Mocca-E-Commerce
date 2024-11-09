import nodemailer from 'nodemailer';
import crypto from 'crypto';

let otpStorage = {}; 

//configure
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'moccafasion@gmail.com',
        pass: 'medm uadx xzyg rqbu'
    }
});

//  send OTP email
const sendOTP = async (req, res) => {
    const { email } = req.body;
    const otp = crypto.randomInt(100000, 999999); 

    otpStorage[email] = otp;
    
    const mailOptions = {
        from: 'your-email@gmail.com',
        to:email,
        subject: 'Welcome to Mocca fasion hub',
        text: `Your OTP code is ${otp}. It expires in 15 minutes.`
    };

    // Send email
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP email:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

// verification 
const verifyOTP = (req, res) => {
    const { email, otp } = req.body;

    if (otpStorage[email] && otpStorage[email] == otp) {
        delete otpStorage[email]; 
        res.status(200).json({ message: 'OTP verified successfully' });
    } else {
        res.status(400).json({ message: 'Invalid or expired OTP' });
    }
};

export { sendOTP, verifyOTP };
