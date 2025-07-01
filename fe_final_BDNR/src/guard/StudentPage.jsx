import { useNavigate } from "react-router";

export const StudentPage = ({ children }) => {
  const session = JSON.parse(localStorage.getItem("credentials"));
  const navigate = useNavigate();

  if (session.role !== "teacher") {
    navigate("/login");
  }

  return children;
};
