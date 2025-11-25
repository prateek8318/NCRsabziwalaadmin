import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // for initial check

  const fetchAdminProfile = async () => {
    try {
      // First check if token exists in localStorage
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      const res = await axiosInstance.get("/api/admin/settings"); // Your protected route
      if (res.data.status) {
        setAdmin(res.data.data);
      } else {
        // Clear invalid token
        localStorage.removeItem("adminToken");
        setAdmin(null);
      }
    } catch (err) {
      console.log(err);
      // Clear invalid token on error
      localStorage.removeItem("adminToken");
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminIfNeeded = async () => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      setAdmin(null);
      setLoading(false);
      return;
    }

    if (!admin) {
      setLoading(true);
      await fetchAdminProfile();
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const adminLogin = (adminData) => {
    setAdmin(adminData);
  };

  const adminLogout = async () => {
    try {
      await axiosInstance.post("/api/admin/logout");
    } catch (err) {
      console.error("Admin logout failed:", err);
    }
    // Always clear the token and admin state
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{ admin, adminLogin, adminLogout, loading, fetchAdminIfNeeded }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
