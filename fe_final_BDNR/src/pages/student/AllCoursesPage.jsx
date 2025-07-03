import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllAvailableCourses, enrollToCourse, getCourseStudent } from "@/service/studentService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, User, Calendar, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const AllCoursesPage = () => {
  const queryClient = useQueryClient();

  const { data: allCourses, isPending: coursesLoading, error: coursesError } = useQuery({
    queryKey: ["all-courses"],
    queryFn: getAllAvailableCourses,
  });

  const { data: enrolledCourses, isPending: enrolledLoading } = useQuery({
    queryKey: ["listCourse"],
    queryFn: getCourseStudent,
  });

  const enrollMutation = useMutation({
    mutationFn: enrollToCourse,
    onSuccess: (data) => {
      toast.success("Berhasil bergabung ke course!");
      queryClient.invalidateQueries(["listCourse"]);
      queryClient.invalidateQueries(["student-overview"]);
      queryClient.invalidateQueries(["student-courses-detailed"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal bergabung ke course");
    },
  });

  const handleEnroll = (courseId) => {
    enrollMutation.mutate(courseId);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(["all-courses"]);
    queryClient.invalidateQueries(["listCourse"]);
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses?.courses?.some(course => course._id === courseId);
  };

  if (coursesLoading || enrolledLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading courses...</div>
      </div>
    );
  }

  if (coursesError) {
    return (
      <div className="ml-10 flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Error loading courses</p>
          <p className="text-gray-600">{coursesError.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-10 space-y-6">
      {/* Header */}
      <div className="bg-black text-white p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Jelajahi Course Tersedia
            </h1>
            <p className="text-green-100">
              Temukan course yang sesuai dengan minat pembelajaran Anda
            </p>
          </div>
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            className="bg-white text-green-600 hover:bg-gray-100"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!allCourses || !allCourses.courses || allCourses.courses.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Belum ada course yang tersedia
            </p>
            <Button onClick={handleRefresh} className="mt-4">
              Refresh
            </Button>
          </div>
        ) : (
          allCourses?.courses?.map((course) => (
            <Card key={course._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  {course.description || "Tidak ada deskripsi tersedia"}
                </p>
                
                <div className="space-y-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>Instructor: {course.createdBy?.email || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Dibuat: {new Date(course.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-3 w-3" />
                    <span>{course.materials?.length || 0} materi tersedia</span>
                  </div>
                </div>

                <div className="pt-2">
                  {isEnrolled(course._id) ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Sudah Terdaftar
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleEnroll(course._id)}
                      disabled={enrollMutation.isPending}
                      className="w-full"
                    >
                      {enrollMutation.isPending ? "Mendaftar..." : "Bergabung"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AllCoursesPage;
