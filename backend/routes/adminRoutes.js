import express from 'express'
import { adminLogin, getUserList } from '../controller/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import admin from '../middleware/authAdminMiddleware.js'


const admin_routes = express.Router()
admin_routes.use(express.json())

admin_routes.post('/login',adminLogin)
admin_routes.get('/userlist',protect,admin,getUserList)


export default  admin_routes