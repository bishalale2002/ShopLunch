import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.js";
import About from "./pages/About.js";
import Contact from "./pages/Contact.js";
import Policy from "./pages/Policy.js";
import Pagenotfound from "./pages/Pagenotfound.js";
import Register from "./pages/auth/Register.js";
import Login from "./pages/auth/Login.js";
import DashBoard from "./pages/user/DashBoard.js";
import PrivateRoute from "./components/Routes/Private.js";
import ForgotPassword from "./pages/auth/ForgotPassword.js";
import AdminRoute from "./components/Routes/AdminRoute.js";
import AdminDashboard from "./pages/Admin/AdminDashboard.js";
import Createcategory from "./pages/Admin/Createcategory.js";
import CreateProduct from "./pages/Admin/CreateProduct.js";
import Users from "./pages/Admin/Users.js";
import Orders from "./pages/user/Orders.js";
import Profile from "./pages/user/Profile.js";
import Products from "./pages/Admin/Products.js";
import UpdateProduct from "./pages/Admin/UpdateProduct.js";
import Search from "./pages/Search.js";
import ProductDetails from "./pages/ProductDetails.js";
import Categories from "./pages/Categories.js";
import CategoryProduct from "./pages/CategoryProduct.js";
function App() {
  return (
    <Routes>
      {" "}
      <Route path="/product-details/:slug" element={<ProductDetails />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/categories/:slug" element={<CategoryProduct />} />
      <Route path="/search" element={<Search />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<PrivateRoute />}>
        <Route path="user" element={<DashBoard />} />
        <Route path="user/orders" element={<Orders />} />
        <Route path="user/profile" element={<Profile />} />
      </Route>
      <Route path="/dashboard" element={<AdminRoute />}>
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/create-categoty" element={<Createcategory />} />
        <Route path="admin/create-product" element={<CreateProduct />} />
        <Route path="admin/product/:slug" element={<UpdateProduct />} />
        <Route path="admin/products" element={<Products />} />
        <Route path="admin/users" element={<Users />} />
      </Route>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/policy" element={<Policy />} />
      <Route path="/*" element={<Pagenotfound />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
