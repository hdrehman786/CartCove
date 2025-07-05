import { createBrowserRouter } from 'react-router-dom';
import App from '../App';

import SearchPage from '../pages/SearchPage';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/forgotpassword/ForgotPassword';
import ResetOtp from '../pages/forgotpassword/VerifyOtp';
import UpdatePassword from '../pages/forgotpassword/ResetPassword';
import UserMenuePage from '../pages/UserMenuePage';
import Dashboard from '../layoutes/Dashboard';
import Profile from '../pages/Profile';
import Myorder from '../pages/Myorder';
import Address from '../pages/Address';
import Category from '../pages/Category';
import UploadProduct from '../pages/UploadProduct';
import ProductsAdmin from '../pages/ProductsAdmin';
import SubCategory from '../pages/SubCategory';
import ProductDetailPage from '../pages/ProductDetailPage';
import ProductShowDetails from '../components/ProductDetails';
import MyCart from '../pages/MyCart';
import CheckoutPage from '../pages/Checkoutpage';
import PaymentSuccess from '../components/paymentsuccess';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: 'search',
                element: <SearchPage />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />
            },
            {
                path: 'reset-otp',
                element: <ResetOtp />
            },
            {
                path: 'reset-password',
                element: <UpdatePassword />
            },
            {
                path: 'user-menue',
                element: <UserMenuePage />
            },
            {
                path: '/dashboard',
                element: <Dashboard />,
                children: [
                    {
                        path: 'category',
                        element: <Category />
                    },
                    {
                        path: 'subcategory',
                        element: <SubCategory />
                    },
                    {
                        path: 'upload-product',
                        element: <UploadProduct />
                    },
                    {
                        path: 'products-admin',
                        element: <ProductsAdmin />
                    },
                    {
                        path: 'profile',
                        element: <Profile />
                    },
                    {
                        path: 'myorder',
                        element: <Myorder />
                    },
                    {
                        path: "address",
                        element: <Address />
                    }
                ]
            },
            {
                path: "/payment-success",
                element: <PaymentSuccess />
            },
        {
                path: ":category",
                children: [
                    {
                        path: ":subCategory",
                        element: <ProductDetailPage />
                    }
                ]
            },
            {
                path: "/products/:product",
                element: <ProductShowDetails />
            },
            {
                path: "/products/mycart",
                element: <MyCart />
            },
            {
                path: "/products/checkout",
                element: <CheckoutPage />
            }
        ]
    }

])


export default router;