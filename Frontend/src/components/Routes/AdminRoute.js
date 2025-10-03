import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";

const AdminRoute = () => {
  const [auth, , loading] = useAuth();

  if (loading) return <p>Loading...</p>;

  return auth?.user?.role === 1 ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
