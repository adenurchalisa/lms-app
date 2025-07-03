import { Navigate } from "react-router";
import { isAuthenticated, hasRole, isTokenExpired, logout } from "@/lib/auth";
import { Layout } from "@/components/Layout";

export const TeacherPage = ({ children }) => {
  // Check if token is expired
  if (isTokenExpired()) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has teacher role
  if (!hasRole("teacher")) {
    return <Navigate to="/dashboard/student" replace />;
  }

  return <Layout />;
};
