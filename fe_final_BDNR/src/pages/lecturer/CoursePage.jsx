import { CardContentCourse } from "@/components/CardContentCourse";
import { CardCourseSkeleton } from "@/components/CardCourseSkeleton";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { TeacherPage } from "@/guard/TeacherPage";
import { deleteCourse, getCourseByTeacher } from "@/service/courseService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { toast } from "sonner";

const CoursePage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourseByTeacher,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course berhasil dihapus");
    },
  });

  const onDeleteHandle = async (courseId) => {
    try {
      await mutateAsync(courseId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus course");
    }
  };

  return (
    <div className="ml-10 space-y-10 mr-10">
      <Toaster />
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-3xl">Daftar Course</h1>
        <Link to="/dashboard/teacher/courses/create">
          <Button>Buat Course</Button>
        </Link>
      </div>
      <div className="max-w-3xl mx-auto space-y-5">
        {isLoading ? (
          <CardCourseSkeleton />
        ) : (
          <div className="mt-2">
            {data.courses.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                Belum ada course yang ditambahkan
              </p>
            ) : (
              data.courses.map((course) => (
                <CardContentCourse
                  key={course._id}
                  id={course._id}
                  title={course.title}
                  description={course.description}
                  isPending={isPending}
                  onHandleDelete={onDeleteHandle}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursePage;
