import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { message } from "antd";

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

      const res = await axiosInstance.get("/api/admin/profile"); // Use profile API instead
      console.log('AuthContext - Profile API response:', res.data);
      
      if (res.data.success) {
        setAdmin(res.data.data);
        console.log('AuthContext - Admin data set:', res.data.data);
      } else {
        // Clear invalid token
        localStorage.removeItem("adminToken");
        setAdmin(null);
      }
    } catch (err) {
      console.log('AuthContext - Error fetching profile:', err);
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
      // Clear auth data before API call
      localStorage.removeItem("adminToken");
      setAdmin(null);
      
      const response = await axiosInstance.post("/api/admin/logout");
      console.log('Logout API response:', response.data);
      
      if (response.data.success) {
        console.log('Logout successful');
        // Use message from antd
        message.success('Logged out successfully');
        
        // Add small delay to ensure notification appears before redirect
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 1000); // Increased delay to 1 second
      } else {
        console.log('Logout API returned non-success:', response.data);
        message.success('Logged out successfully'); // Still show success even if API fails
        
        // Add small delay to ensure notification appears before redirect
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 1000);
      }
    } catch (err) {
      console.error("Admin logout failed:", err);
      // Still show success and redirect even on error
      message.success('Logged out successfully');
      
      // Add small delay to ensure notification appears before redirect
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 1000);
    }
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
