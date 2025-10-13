import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(sessionStorage.getItem("user")); // สมมติ user object เก็บ role ไว้
  const isLoggedIn = !!user;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // ถ้ามี allowedRoles และ role ไม่ตรง
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
