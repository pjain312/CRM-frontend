import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

export default function PublicRoute() {
  if (isLoggedIn()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
