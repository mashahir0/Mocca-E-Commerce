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
        if (user && (await user.matchPassword(password))) {
            return res.status(200).json({
                message: 'user logged',
                user // Optional: include user data if needed
            })
        } else {
            return res.status(401).json({  // 401 indicates unauthorized
                message: 'Invalid email or password'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' })
    }
}


export {registerUser,userLogin}