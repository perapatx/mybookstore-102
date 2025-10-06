import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = sessionStorage.getItem("user");

  if (!user) {
    // ถ้าไม่มี user -> เด้งไปหน้า login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
