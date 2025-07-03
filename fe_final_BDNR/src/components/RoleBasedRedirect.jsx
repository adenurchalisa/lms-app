import { Navigate } from "react-router";
import {
  getSession,
  isAuthenticated,
  isTokenExpired,
  logout,
} from "@/lib/auth";

export const RoleBasedRedirect = () => {
  // Check if token is expired
  if (isTokenExpired()) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const session = getSession();
  const userRole = session?.role;

  // Redirect based on user role
  switch (userRole) {
    case "teacher":
      return <Navigate to="/dashboard/teacher" replace />;
    case "student":
      return <Navigate to="/dashboard/student" replace />;
    default:
      // If role is unknown, logout and redirect to login
      logout();
      return <Navigate to="/login" replace />;
  }
};
