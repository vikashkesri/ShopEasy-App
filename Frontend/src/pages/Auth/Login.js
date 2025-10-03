import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [auth, , , login] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  if (auth?.token) return <Navigate to="/dashboard/user" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        login({ user: res.data.user, token: res.data.token });
        navigate(location.state?.from || "/dashboard/user");
      } else {
        toast.error(res.data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error.response || error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login - Ecommerce App">
      <div
        className="form-container"
        style={{
          minHeight: "90vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "400px",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
          }}
        >
          <h4 className="title text-center mb-4">LOGIN FORM</h4>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control mb-3"
            placeholder="Enter Your Email"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control mb-3"
            placeholder="Enter Your Password"
            required
          />

          <button
            type="button"
            className="btn btn-secondary w-100 mb-3"
            onClick={() => navigate("/forgot-password")}
            style={{ padding: "10px", fontSize: "16px" }}
          >
            Forgot Password
          </button>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
            style={{ padding: "10px", fontSize: "16px" }}
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;
