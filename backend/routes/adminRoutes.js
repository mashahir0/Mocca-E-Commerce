import express from 'express'
import { adminLogin, getUserList, toggleStatus ,deleteUser, refreshTokenHandler } from '../controller/adminController.js'
import { protect } from '../middleware/authMiddleware.js'
import admin from '../middleware/authAdminMiddleware.js'
import { addCategory, deleteCategory, editStatus, getCategory, listCategory } from '../controller/categoryController.js'
import { addProduct, getDetailsForEdit, getProducts, toggleProductAvailability, updateProduct } from "../controller/productController.js";


const admin_routes = express.Router()
admin_routes.use(express.json())

admin_routes.post('/refresh-token', refreshTokenHandler);
admin_routes.post('/login',adminLogin)
admin_routes.get('/userlist',protect,admin,getUserList)
admin_routes.patch('/admin/toggleStatus/:customerId', toggleStatus);
admin_routes.delete('/deleteUser/:customerId',deleteUser);

//category 

admin_routes.get('/get-category',protect,admin,getCategory)
admin_routes.post('/add-category',addCategory)
admin_routes.patch('/update-categories/:id',editStatus)
admin_routes.get('/list-category',listCategory)
admin_routes.delete('/delete-categories/:id',deleteCategory)

//Product management

admin_routes.post("/addproduct", addProduct); 
admin_routes.get('/get-products',protect,admin,getProducts) 
admin_routes.put('/toggle-product/:id',toggleProductAvailability)
admin_routes.get('/edit-product-details/:id',getDetailsForEdit)
admin_routes.put('/update-product/:id',updateProduct)



export default  admin_routes