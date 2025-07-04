import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeacherDashboard from "./pages/lecturer/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import CreateCoursePage from "./pages/lecturer/CreateCoursePage";
import CoursePage from "./pages/lecturer/CoursePage";
import CourseDetailPage from "./pages/lecturer/CourseDetailPage";
import { RoleBasedRedirect } from "@/components/RoleBasedRedirect";
import { TeacherPage } from "./guard/TeacherPage";
import { StudentPage } from "./guard/StudentPage";
import CourseStudentDetailPage from "./pages/student/CourseStudentDetailPage";
import AllCoursesPage from "./pages/student/AllCoursesPage";
import ProfilePage from "./pages/student/ProfilePage";
import StudentQuizPage from "./pages/student/QuizPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Role-based redirect for /dashboard */}
        <Route path="/dashboard" element={<RoleBasedRedirect />} />

        {/* Teacher Routes with nested structure */}
        <Route path="/dashboard/teacher" element={<TeacherPage />}>
          <Route index element={<TeacherDashboard />} />
          <Route path="courses" element={<CoursePage />} />
          <Route path="courses/create" element={<CreateCoursePage />} />
          <Route path="courses/:id/detail" element={<CourseDetailPage />} />
        </Route>

        {/* Student Routes with nested structure */}
        <Route path="/dashboard/student" element={<StudentPage />}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<AllCoursesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path=":id/detail" element={<CourseStudentDetailPage />} />
        </Route>

        {/* Quiz Route (outside of student dashboard for full screen) */}
        <Route path="/quiz/:quizId" element={<StudentQuizPage />} />
      </Routes>
    </>
  );
}

export default App;
