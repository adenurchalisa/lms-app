import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudentOverview, getEnrolledCoursesDetailed } from "@/service/studentService";
import { useQuery } from "@tanstack/react-query";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Bar,
  BarChart,
  Legend,
} from "recharts";
import { BookOpen, FileText, Calendar, User } from "lucide-react";
import { Link } from "react-router";

const Dashboard = () => {
  const { data: overview, isPending: overviewLoading, error: overviewError } = useQuery({
    queryKey: ["student-overview"],
    queryFn: getStudentOverview,
  });

  const { data: coursesData, isPending: coursesLoading, error: coursesError } = useQuery({
    queryKey: ["student-courses-detailed"],
    queryFn: getEnrolledCoursesDetailed,
  });

  if (overviewLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (overviewError || coursesError) {
    return (
      <div className="ml-10 flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Error loading dashboard</p>
          <p className="text-gray-600">
            {overviewError?.message || coursesError?.message || "Unknown error"}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
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
        <h1 className="text-3xl font-bold mb-2">
          Selamat datang di Dashboard Student
        </h1>
        <p className="text-blue-100">
          Kelola pembelajaran Anda dan pantau progress di sini
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Course Terdaftar
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {overview?.totalCoursesEnrolled || 0}
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
                  Total Materi
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {overview?.totalMaterials || 0}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Course Terbaru
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {overview?.recentCourses?.length || 0}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Progress Chart */}
      {overview?.enrollmentProgress?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Progress Pendaftaran Course
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-white rounded-xl shadow p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overview.enrollmentProgress}
                  margin={{ top: 5, right: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    label={{
                      value: "Jumlah Course",
                      position: "insideLeft",
                      angle: -90,
                    }}
                  />
                  <Legend />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Course Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent>
          {overview?.recentCourses?.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              Belum ada course yang diikuti
            </p>
          ) : (
            <div className="space-y-4">
              {overview?.recentCourses?.map((course) => (
                <div
                  key={course._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{course.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {course.materialCount} materi
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Bergabung: {new Date(course.enrolledAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                  <Link to={`${course._id}/detail`}>
                    <Button variant="outline" size="sm">
                      Lihat Detail
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Enrolled Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Semua Course yang Diikuti
          </CardTitle>
        </CardHeader>
        <CardContent>
          {coursesData?.courses?.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                Belum ada course yang diikuti
              </p>
              <Button asChild>
                <Link to="courses">
                  Jelajahi Course
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coursesData?.courses?.map((course) => (
                <div
                  key={course._id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {course.instructor}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {course.materialCount} materi
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Bergabung: {new Date(course.enrolledAt).toLocaleDateString('id-ID')}
                    </span>
                    <Link to={`${course._id}/detail`}>
                      <Button size="sm">
                        Buka Course
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
