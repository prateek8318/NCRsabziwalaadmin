import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { Spin } from "antd";

const AdminPrivateRoute = ({ children }) => {
    const { admin, fetchAdminIfNeeded, loading } = useAuth();

    useEffect(() => {
        // Try to restore session from cookie if admin is null
        if (!admin) fetchAdminIfNeeded?.();
    }, [admin, fetchAdminIfNeeded]);

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
