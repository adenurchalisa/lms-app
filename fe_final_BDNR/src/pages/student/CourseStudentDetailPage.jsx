import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseById } from "@/service/courseService";
import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";
import { useParams } from "react-router";

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

  if (isLoading) return <div>Loading course details...</div>;
  if (error) return <div>Error loading course: {error.message}</div>;

  console.log(course);

  return (
    <div className="ml-10 space-y-4">
      <div className="bg-white border-b pb-5 mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {course.course.title}
        </h1>
        <p> {course.course.description}</p>
      </div>
      {course.course.materials.length === 0 ? (
        <p className="text-center py-8 text-gray-500">
          Belum ada materi yang ditambahkan oleh teacher
        </p>
      ) : (
        course.course.materials.map((material) => (
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600 text-2xl">
                {material.title}
                
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                <FileText className="w-5 h-5 text-red-500" />
                <a href={material.content} target="_blank">
                  <Button variant="link"> Materi Pembelajaran</Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default CourseStudentDetailPage;
