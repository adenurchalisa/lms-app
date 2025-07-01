import { Navigate } from "react-router";
export const TeacherPage = ({ children }) => {
  const session = JSON.parse(localStorage.getItem("credentials"));

  if (!session) {
    return <Navigate to="/login" />;
  }

  return children;
};
