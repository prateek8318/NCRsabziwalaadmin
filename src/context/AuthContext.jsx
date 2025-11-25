import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // for initial check

  const fetchAdminProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/settings"); // Your protected route
      if (res.data.status) {
        setAdmin(res.data.data);
      }
    } catch (err) {
      console.log(err);
      setAdmin(null);
    } finally {
      setLoading(false);
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
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, adminLogin, adminLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
