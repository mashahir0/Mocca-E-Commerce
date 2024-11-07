import express from 'express'
import { registerUser } from '../controller/userController.js'
import { userExistance } from '../middleware/userMiddleware.js'
const user_routes = express.Router()
user_routes.use(express.json())

user_routes.post('/register',userExistance,registerUser)


export default  user_routes