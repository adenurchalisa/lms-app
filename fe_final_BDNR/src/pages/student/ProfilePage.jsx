import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { authLogout } from "@/service/authService";
import { getStudentOverview } from "@/service/studentService";
import { useQuery } from "@tanstack/react-query";
import { User, Mail, Calendar, BookOpen, FileText, LogOut } from "lucide-react";

const ProfilePage = () => {
  const session = getSession();
  
  const { data: overview, isPending } = useQuery({
    queryKey: ["student-overview"],
    queryFn: getStudentOverview,
  });

  const handleLogout = () => {
    authLogout();
  };

  return (
    <div className="ml-10 space-y-6">
      {/* Header */}
      <div className="bg-black text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-2">
          Profile Saya
        </h1>
        <p className="text-purple-100">
          Kelola informasi akun dan lihat ringkasan aktivitas Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Akun
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{session?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-medium capitalize">{session?.role}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Member Sejak</p>
                  <p className="font-medium">
                    {new Date().toLocaleDateString('id-ID', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Statistik Pembelajaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPending ? (
                <div className="text-center text-gray-500">
                  Loading...
                </div>
              ) : (
                <>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">
                      {overview?.totalCoursesEnrolled || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      Course Diikuti
                    </div>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">
                      {overview?.totalMaterials || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      Total Materi
                    </div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">
                      {overview?.recentCourses?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      Course Terbaru
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          {overview?.recentCourses?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Aktivitas Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overview.recentCourses.slice(0, 3).map((course) => (
                    <div key={course._id} className="text-sm">
                      <p className="font-medium">{course.title}</p>
                      <p className="text-gray-500 text-xs">
                        Bergabung {new Date(course.enrolledAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
