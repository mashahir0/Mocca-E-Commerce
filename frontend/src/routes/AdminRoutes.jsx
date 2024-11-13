import AdminAddProductPage from "../pages/admin/AdminAddProductPage";
import AdminDashPage from "../pages/admin/AdminDashPage";
import AdminEditProductPage from "../pages/admin/AdminEditProductPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminProductListPage from "../pages/admin/AdminProductListPage";
import AdminUserListPage from "../pages/admin/AdminUserListPage";
import CategoryManagmentPage from "../pages/admin/CategoryManagmentPage";
import ReqAdminAuth from "../redux/protect/ReqAdminAuth";
import ReqAdminLoginAuth from "../redux/protect/ReqAdminLoginAuth";


const adminRoutes = [
    {
        path:'/admin/login',
        element :<ReqAdminLoginAuth><AdminLoginPage/></ReqAdminLoginAuth>
    },
    {
        path:'/admin/dashboard',
        element :<ReqAdminAuth><AdminDashPage/></ReqAdminAuth> 
    },
    {
        path:'/admin/userlist',
        element :<ReqAdminAuth> <AdminUserListPage/></ReqAdminAuth> 
    },
    {
        path:'/admin/productlist',
        element : <AdminProductListPage/>
    },
    {
        path:'/admin/addproduct',
        element : <AdminAddProductPage/>
    },
    {
        path:'/admin/editproduct',
        element : <AdminEditProductPage/>
    },
    {
        path:'/admin/category',
        element : <CategoryManagmentPage/>
    },
]


export default adminRoutes