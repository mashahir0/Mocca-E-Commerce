import UserRegPage from "../pages/user/UserRegPage";
import UserLoginPage from "../pages/user/UserLoginPage";
import ForgotPage from '../pages/user/ForgotPage'
import HomePage from '../pages/user/HomePage'
import { Navigate } from "react-router-dom";

const UserRoutes = [
    {
        path:'/',
        element:<Navigate to="/login"/>
    },
    {
        path:'/login',
        element :<UserLoginPage/>
    },
    {
        path:'/register',
        element: <UserRegPage/>
    },
    {
        path:'/forgotpass',
        element: <ForgotPage/>
    },
    {
        path:'/home',
        element: <HomePage/>
    }
]

export default UserRoutes