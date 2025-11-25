import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { Spin } from "antd";

const AdminPrivateRoute = ({ children }) => {
  const { admin, fetchAdminIfNeeded, loading } = useAuth();

  useEffect(() => {
    // Check token existence and fetch admin data if needed
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      // No token found, don't even try to fetch
      return;
    }
    if (!admin) {
      fetchAdminIfNeeded?.();
    }
  }, [admin, fetchAdminIfNeeded]);

  // Double check: if no token in localStorage, redirect immediately
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return admin ? children : <Navigate to="/admin/login" replace />;
};

export default AdminPrivateRoute;

// import { Navigate } from "react-router";
// import { useAuth } from "../context/AuthContext";

// const AdminPrivateRoute = ({ children }) => {
//     const { adminToken } = useAuth();

//     return adminToken ? children : <Navigate to="/admin/login" replace />;
// };

// export default AdminPrivateRoute;
