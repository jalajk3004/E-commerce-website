import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const Admin = () => {
    const location = useLocation();

    // Redirect /admin to /admin/dashboard
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Admin;
