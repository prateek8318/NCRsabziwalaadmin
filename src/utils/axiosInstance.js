const BASE_URL = import.meta.env.VITE_BASE_URL;
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // ⬅️ very important for cookie auth
    headers: { "Content-Type": "application/json" }
});

// Add auth token automatically if exists
axiosInstance.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem('adminToken');
    const vendorToken = localStorage.getItem('vendorToken');

console.log(adminToken,"ffffffffffffffff......")
    if (config.url.includes("/api/admin")) {
        // console.log("Admin Token on axios :".adminToken)
        if (adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
        }
    } else if (config.url.includes("api/vendor")) {
        if (vendorToken) {
            config.headers.Authorization = `Bearer ${vendorToken}`;
        }
    }

    return config;
});

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
            console.log('401 Error - Token expired or invalid');
            // Clear tokens
            localStorage.removeItem('adminToken');
            localStorage.removeItem('vendorToken');
            
            // Redirect to login page
            if (window.location.pathname !== '/admin/login') {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;