import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosInstance";
import { useNavigate, Navigate } from "react-router";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { adminLogin, admin } = useAuth();

  // ✅ Redirect if already logged in
  if (admin) {
    return <Navigate to="/admin" replace />;
  }

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/admin/login", values);

      if (res.data.status && res.data.data?.user) {
        // ✅ Save token in localStorage
        localStorage.setItem("adminToken", res.data.token);

        // ✅ Save user in context
        adminLogin(res.data.data.user);

        message.success("Login successful!");
        navigate("/admin");
      } else {
        message.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <title>NCR Sabziwala | Admin Login</title>
      <div className="flex min-h-screen bg-gray-100">
        {/* Left image */}
        <div className="hidden lg:flex w-1/2 justify-center items-center bg-gray-200">
          <img
            src="https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Login Visual"
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right side - Form card */}
        <div className="flex w-full lg:w-1/2 justify-center items-center px-4 sm:px-6 py-12">
          <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-4xl font-bold text-center text-green-600 mb-2">
              Admin Login
            </h2>
            <p className="text-sm text-gray-500 text-center mb-8">
              Sign in to your admin dashboard
            </p>

            <Form
              name="login"
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email!",
                    type: "email",
                  },
                ]}
              >
                <Input size="large" placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                ]}
              >
                <Input.Password size="large" placeholder="********" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                >
                  Log In
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
