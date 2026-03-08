import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Admin from "../admin/Admin";
import Dashboard from "../admin/components/Dashboard";
import Products from "../admin/components/Products";
import Customers from "../admin/components/Customers";
import Orders from "../admin/components/Orders";
import AddProduct from "../admin/components/AddProduct";

const ProtectedAdminRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('admin_auth') === 'true';
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }
    return children;
};

const AdminRouter = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<ProtectedAdminRoute><Admin /></ProtectedAdminRoute>}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<Products />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="product/create" element={<AddProduct />} />
                </Route>
            </Routes>
        </div>
    );
};

export default AdminRouter;