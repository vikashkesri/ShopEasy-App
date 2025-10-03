import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";

const PrivateRoute = () => {
  const [auth, , loading] = useAuth();

  if (loading) return <p>Loading...</p>; // optional spinner

  return auth?.token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
