import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/lecturer/Dashboard";
import CreateCoursePage from "./pages/lecturer/CreateCoursePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/courses/create" element={<CreateCoursePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
