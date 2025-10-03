import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/forgot-password", 
        { email, newPassword, answer },
        { headers: { "Content-Type": "application/json" } } 
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Forgot password error:", error.response || error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Forgot Password - Ecommerce App">
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
          <h4 className="title text-center mb-4">RESET PASSWORD</h4>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control mb-3"
            placeholder="Enter Your Email"
            required
          />

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="form-control mb-3"
            placeholder="Enter Your Favorite Sport"
            required
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control mb-3"
            placeholder="Enter Your New Password"
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
            style={{ padding: "10px", fontSize: "16px" }}
          >
            {loading ? "Processing..." : "RESET"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
