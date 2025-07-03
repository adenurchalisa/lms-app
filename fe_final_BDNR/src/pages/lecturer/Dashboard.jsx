import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOverview } from "@/service/overviewService";
import { getCourseByTeacher } from "@/service/courseService";
import { useQuery } from "@tanstack/react-query";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  Legend,
} from "recharts";
import { BookOpen, Users, TrendingUp, Plus, Eye } from "lucide-react";
import { Link } from "react-router";

const Dashboard = () => {
  const { data: dataOverview, isPending: overviewLoading, error: overviewError } = useQuery({
    queryKey: ["overview"],
    queryFn: getOverview,
  });

  const { data: teacherCourses, isPending: coursesLoading } = useQuery({
    queryKey: ["teacher-courses"],
    queryFn: getCourseByTeacher,
  });

  if (overviewLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (overviewError) {
    return (
      <div className="ml-10 flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Error loading dashboard</p>
          <p className="text-gray-600">{overviewError.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-10 space-y-6">
      {/* Welcome Section */}
      <div className="bg-black text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Dashboard Teacher
            </h1>
            <p className="text-blue-100">
              Kelola course Anda dan pantau aktivitas student
            </p>
          </div>
          <Link to="courses/create">
            <Button 
              variant="outline" 
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Course Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Course
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {dataOverview?.totalCourses || 0}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Student
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {dataOverview?.totalStudents || 0}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Growth Rate
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {dataOverview?.dailyStats?.length > 0 ? '+12%' : '0%'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      {dataOverview?.dailyStats?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Student Enrollment Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-white rounded-xl shadow p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dataOverview.dailyStats}
                  margin={{ top: 5, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis
                    label={{
                      value: "Jumlah Student",
                      position: "insideLeft",
                      angle: -90,
                    }}
                  />
                  <Legend />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* My Courses Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-bold">
              Course Saya
            </CardTitle>
            <Link to="courses">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Lihat Semua
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!teacherCourses || teacherCourses.courses?.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Belum ada course yang dibuat
              </p>
              <Link to="courses/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Course Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teacherCourses.courses.slice(0, 6).map((course) => (
                <div
                  key={course._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {course.description || "Tidak ada deskripsi"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Course ID: {course._id.slice(-6)}
                    </span>
                    <Link to={`courses/${course._id}/detail`}>
                      <Button size="sm">
                        Kelola
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="courses/create">
              <Button className="w-full h-16 text-left justify-start">
                <Plus className="h-6 w-6 mr-3" />
                <div>
                  <p className="font-medium">Buat Course Baru</p>
                  <p className="text-sm opacity-80">Tambah course untuk student</p>
                </div>
              </Button>
            </Link>
            <Link to="courses">
              <Button variant="outline" className="w-full h-16 text-left justify-start">
                <BookOpen className="h-6 w-6 mr-3" />
                <div>
                  <p className="font-medium">Kelola Course</p>
                  <p className="text-sm opacity-80">Edit dan hapus course existing</p>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
