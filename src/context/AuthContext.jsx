import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { message } from "antd";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // for initial check

  // Load admin data from localStorage as fallback
  const loadAdminFromStorage = () => {
    try {
      const adminData = localStorage.getItem("adminData");
      if (adminData) {
        const parsedAdmin = JSON.parse(adminData);
        console.log('Loading admin data from localStorage:', parsedAdmin);
        return parsedAdmin;
      }
    } catch (err) {
      console.log('Error loading admin data from storage:', err);
    }
    return null;
  };

  const fetchAdminProfile = async () => {
    try {
      // First check if token exists in localStorage
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        console.log('No token found in localStorage');
        setAdmin(null);
        setLoading(false);
        return;
      }

      console.log('Fetching admin profile with token:', adminToken.substring(0, 20) + '...');
      const res = await axiosInstance.get("/api/admin/profile"); // Use profile API instead
      console.log('AuthContext - Profile API response:', res.data);
      
      if (res.data.success || res.data.status) {
        const adminData = res.data.data || res.data.user;
        setAdmin(adminData);
        // Save admin data to localStorage as backup
        localStorage.setItem("adminData", JSON.stringify(adminData));
        console.log('AuthContext - Admin data set:', adminData);
      } else {
        // Clear invalid token
        console.log('Invalid response, clearing token');
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        setAdmin(null);
      }
    } catch (err) {
      console.log('AuthContext - Error fetching profile:', err);
      console.log('Error response:', err.response?.data);
      console.log('Error status:', err.response?.status);
      
      // For now, if there's a token and we get an error, try to load from storage
      const adminToken = localStorage.getItem("adminToken");
      if (adminToken) {
        console.log('API failed, trying to load admin data from storage');
        const storedAdmin = loadAdminFromStorage();
        if (storedAdmin) {
          console.log('Using stored admin data as fallback');
          setAdmin(storedAdmin);
        } else {
          console.log('No stored admin data found');
          if (err.response?.status === 401) {
            // Only clear on actual 401 (unauthorized)
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminData");
            setAdmin(null);
          }
        }
      } else {
        // No token at all, clear state
        setAdmin(null);
      }
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
    // Save admin data to localStorage as backup
    localStorage.setItem("adminData", JSON.stringify(adminData));
  };

  const adminLogout = async () => {
    try {
      // Clear auth data before API call
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
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
