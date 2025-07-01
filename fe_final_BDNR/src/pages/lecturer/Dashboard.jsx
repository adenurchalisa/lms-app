import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { TeacherPage } from "@/guard/TeacherPage";

const Dashboard = () => {
  return (
    <TeacherPage>
      <Link to="/courses/create">
        <Button>Buat Course</Button>
      </Link>
    </TeacherPage>
  );
};

export default Dashboard;
