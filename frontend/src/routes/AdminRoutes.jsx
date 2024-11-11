import AdminAddProductPage from "../pages/admin/AdminAddProductPage";
import AdminDashPage from "../pages/admin/AdminDashPage";
import AdminEditProductPage from "../pages/admin/AdminEditProductPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminProductListPage from "../pages/admin/AdminProductListPage";
import AdminUserListPage from "../pages/admin/AdminUserListPage";
import CategoryManagmentPage from "../pages/admin/CategoryManagmentPage";


const adminRoutes = [
    {
        path:'/admin/login',
        element : <AdminLoginPage/>
    },
    {
        path:'/admin/dashboad',
        element : <AdminDashPage/>
    },
    {
        path:'/admin/userlist',
        element : <AdminUserListPage/>
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