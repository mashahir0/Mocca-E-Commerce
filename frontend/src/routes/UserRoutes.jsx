import UserRegPage from "../pages/user/UserRegPage";
import UserLoginPage from "../pages/user/UserLoginPage";
import ForgotPage from '../pages/user/ForgotPage'
import HomePage from '../pages/user/HomePage'
import { Navigate } from "react-router-dom";
import ProductsPage from "../pages/user/ProductsPage";
import ProductInfo from "../pages/user/ProductInfoPage";
import CartPage from "../pages/user/CartPage";
import WishListPage from "../pages/user/WishListPage";
import RequireAuth from "../redux/protect/requireAuth";
import RequireAuthLogin from "../redux/protect/RequireAuthLogin";

const UserRoutes = [
    {
        path:'/',
        element:<Navigate to="/home"/>
    },
    {   
        path:'/login',
        element :<RequireAuthLogin><UserLoginPage/></RequireAuthLogin>
    },
    {
        path:'/register',
        element:<RequireAuthLogin><UserRegPage/></RequireAuthLogin>
    },
    {
        path:'/forgotpass',
        element:<RequireAuthLogin><ForgotPage/></RequireAuthLogin> 
    },
    {
        path:'/home',
        element:<HomePage/>
    },
    {
        path:'/products',
        element: <ProductsPage/>
    },
    {
        path:'/productinfo',
        element: <ProductInfo/>
    },
    {
        path:'/cart',
        element:<RequireAuth><CartPage/></RequireAuth> 
    },
    {
        path:'/wishlist',
        element:<RequireAuth><WishListPage/></RequireAuth>  
    },

]

export default UserRoutes