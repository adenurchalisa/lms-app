import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { TeacherPage } from "@/guard/TeacherPage";
import { getCourseById, updateCourse } from "@/service/courseService";
import { deleteMaterial } from "@/service/materialService";
import { toast } from "sonner";
import { Edit, Plus, Trash2, Book, ArrowLeft } from "lucide-react";
import { CreateMaterialForm } from "@/components/CreateMaterialForm";

const CourseDetailPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  // Fetch course data
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    onSuccess: (data) => {
      setCourseTitle(data.course.title);
      setCourseDescription(data.course.description);
    },
  });

  // Update course mutation
  const { mutateAsync: updateCourseAsync, isPending: isUpdating } = useMutation(
    {
      mutationFn: (data) => updateCourse(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["course", id] });
        toast.success("Course updated successfully");
        setIsEditingCourse(false);
      },
    }
  );

  // Delete material mutation
  const { mutateAsync: deleteMaterialAsync, isPending: isDeletingMaterial } =
    useMutation({
      mutationFn: (materialId) => deleteMaterial(materialId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["course", id] });
        toast.success("Material deleted successfully");
        setDeleteDialogOpen(false);
        setMaterialToDelete(null);
      },
    });

  const quizzes = [
    {
      _id: "1",
      title: "React Basics Quiz",
      description: "Test your React knowledge",
      questions: 5,
    },
    {
      _id: "2",
      title: "Hooks Quiz",
      description: "Quiz about React Hooks",
      questions: 3,
    },
  ];

  const handleEditCourse = () => {
    setIsEditingCourse(true);
  };

  const handleSaveCourse = async () => {
    try {
      await updateCourseAsync({
        title: courseTitle,
        description: courseDescription,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update course");
    }
  };

  const handleCancelEdit = () => {
    if (courseData) {
      setCourseTitle(courseData.course.title);
      setCourseDescription(courseData.course.description);
    }
    setIsEditingCourse(false);
  };

  const onHandleDeleteMaterial = async (materialId) => {
    try {
      await deleteMaterialAsync(materialId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete material");
    }
  };

  const handleDeleteMaterialClick = (material) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteMaterial = () => {
    if (materialToDelete) {
      onHandleDeleteMaterial(materialToDelete._id);
    }
  };

  return (
    <TeacherPage>
      <div className="ml-10  space-y-6 mr-10 mb-10">
        <Toaster />

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard/courses">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-medium text-3xl">Course Detail</h1>
        </div>

        {/* Course Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Manage your course details</CardDescription>
            </div>
            {!isEditingCourse && (
              <Button onClick={handleEditCourse} variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditingCourse ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="Enter course title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Input
                    id="description"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Enter course description"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveCourse} disabled={isUpdating}>
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="outline"
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold text-lg">
                    {courseData?.course.title}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {courseData?.course.description}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {courseLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-lg">Lagi loading...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      Materials
                    </CardTitle>
                    <CardDescription>Course learning materials</CardDescription>
                  </div>
                  <CreateMaterialForm courseId={courseData.course._id} />
                </CardHeader>
                <CardContent>
                  {courseData?.course.materials?.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">
                      Belum ada materi yang ditambahkan
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-[200px] overflow-y-scroll overflow-hidden pr-1 no-scrollbar">
                      {courseData?.course.materials.map((material) => (
                        <div
                          key={material._id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <h4 className="font-medium">{material.title}</h4>
                            <a
                              href={material.content}
                              target="_blank"
                              className="text-sm text-gray-600 truncate max-w-xs"
                            >
                              <Button variant="link">Materi Pembelajar</Button>
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleDeleteMaterialClick(material)
                              }
                              disabled={isDeletingMaterial}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Quizzes
                    </CardTitle>
                    <CardDescription>Course assessments</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Quiz
                  </Button>
                </CardHeader>
                <CardContent>
                  {quizzes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No quizzes yet. Create your first quiz!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {quizzes.map((quiz) => (
                        <div
                          key={quiz._id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <h4 className="font-medium">{quiz.title}</h4>
                            <p className="text-sm text-gray-600">
                              {quiz.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {quiz.questions} questions
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Course Statistics</CardTitle>
                <CardDescription>Overview of course engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {courseData.course.materials.length}
                    </div>
                    <div className="text-sm text-gray-600">Materials</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {quizzes.length}
                    </div>
                    <div className="text-sm text-gray-600">Quizzes</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {courseData.course.students.length}
                    </div>
                    <div className="text-sm text-gray-600">
                      Students Enrolled
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Delete Material Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Hapus Materi</DialogTitle>
              <DialogDescription>
                Anda yakin ingin menghapus materi ini?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isDeletingMaterial}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDeleteMaterial}
                disabled={isDeletingMaterial}
              >
                {isDeletingMaterial ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TeacherPage>
  );
};

export default CourseDetailPage;
