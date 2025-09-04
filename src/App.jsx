import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Provider } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";


import store from "./store/store";
import Dashboard from "./pages/Dashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Restaurants from "./pages/ExploreRestaurant";
import AllRestaurantLoader from "./loaders/AllRestaurantLoader";
import RestaurantDetail from "./components/RestaurantDetail";
import RestaurantLoader from "./loaders/getRestaurant";
import MyProfile from "./components/MyProfile";
import ProtectedRoute from "./components/ProtectRoute";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

// Load Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51S3a6u1Fga9c5dvOzDHRRmczDpakQdcCsRv6FktBN6Hbzh8RcOWfnPfzXjFDsLXuQ0nckwunRPu2GWndSyDiTElu00qQ8Y7zJn");

let routes = [
    {
        path : '/',
        element : <Home />
    },
    {
        path : '/login',
        element : <LoginPage />
    },
    {
        path : '/register',
        element : <RegisterPage />
    },
    {
        path : '/forgetpassword',
        element : <ForgetPassword />
    },
    {
        path : '/resetpassword/:token',
        element : <ResetPassword />
    },
    {
        path: "/userdashboard",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path : '/managerdashboard' ,
        element : <ManagerDashboard />
    },
    {
        path : '/admindashboard' ,
        element : <AdminDashboard />
    },
    {
        path : '/restaurant',
        element : <Restaurants />,
        loader : AllRestaurantLoader,
        hydrateFallbackElement: <div>Loading...</div>
    },
    {
        path : '/restaurantdetails',
        element : <RestaurantDetail />,
        loader : RestaurantLoader,
        hydrateFallbackElement: <div>Loading...</div>
    },
    {
        path : '/profile',
        element : <MyProfile />
    },
]

let router = createBrowserRouter(routes ,{
    future: {
        v7_relativeSplatPath: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true,
    }
})

function App(){
    return(
        <Provider store={store}>
            <Elements stripe={stripePromise}>
                <RouterProvider
                    router={router}
                    future={{
                        v7_startTransition: true,
                    }}
                />
            </Elements>
        </Provider>
    )
}

export default App;