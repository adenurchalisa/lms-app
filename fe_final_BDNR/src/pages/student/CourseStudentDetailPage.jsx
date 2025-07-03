import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseById } from "@/service/courseService";
import { useQuery } from "@tanstack/react-query";
import { FileText, ArrowLeft } from "lucide-react";
import { useParams, Link } from "react-router";

const CourseStudentDetailPage = () => {
  const { id } = useParams();
  const {
    isLoading,
    error,
    data: course,
  } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
  });

  console.log("Course ID from params:", id);
  console.log("Course data:", course);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  if (isLoading) {
    return (
      <div className="ml-10 flex items-center justify-center h-96">
        <div className="text-lg">Loading course details...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="ml-10 flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-2">Error loading course</p>
          <p className="text-gray-600">{error.message}</p>
          <div className="mt-4 space-y-2">
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Link to="/dashboard/student">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!course || !course.course) {
    return (
      <div className="ml-10 flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Course tidak ditemukan</p>
          <Link to="/dashboard/student">
            <Button className="mt-4">
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-10 space-y-4">
      {/* Back Button */}
      <div className="mb-4">
        <Link to="/dashboard/student">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>

      <div className="bg-white border-b pb-5 mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {course.course.title}
        </h1>
        <p className="text-gray-600">{course.course.description}</p>
      </div>
      
      {!course.course.materials || course.course.materials.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Belum ada materi yang ditambahkan oleh teacher
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {course.course.materials.map((material, index) => (
            <Card key={material._id || index}>
              <CardHeader>
                <CardTitle className="text-blue-600 text-xl">
                  {material.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="w-5 h-5 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">Materi Pembelajaran</p>
                    <a 
                      href={material.content} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      <Button variant="link" className="p-0 h-auto">
                        Buka Materi
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseStudentDetailPage;
