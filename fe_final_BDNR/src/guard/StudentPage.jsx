import { Navigate } from "react-router";
import { isAuthenticated, hasRole, isTokenExpired, logout } from "@/lib/auth";
import { Layout } from "@/components/Layout";

export const StudentPage = () => {
  // Check if token is expired
  if (isTokenExpired()) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has student role
  if (!hasRole("student")) {
    return <Navigate to="/dashboard/teacher" replace />;
  }

  return <Layout />;
};
