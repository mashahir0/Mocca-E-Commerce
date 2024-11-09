import User from '.././models/userModel.js'

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
        const { email, password } = req.body
        const user = await User.findOne({ email })
        
        // If no user is found
        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }

        // Check if password matches
        if (!(await user.matchPassword(password))) {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }

        // If login is successful
        return res.status(200).json({
            message: 'User logged in successfully',
            user // Optional: include user data if needed
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error' })
    }
}



export {registerUser,userLogin}