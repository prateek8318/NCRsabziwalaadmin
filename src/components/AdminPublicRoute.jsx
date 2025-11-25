// components/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router";
import { Spin } from "antd";
import { useAuth } from "../context/AuthContext";

const AdminPublicRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  // if we're already logged in, send to admin dashboard
  return !admin ? children : <Navigate to="/admin" replace />;
};

export default AdminPublicRoute;
