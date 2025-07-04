import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import courseSchema from "@/lib/schema/courseSchema";
import { postCourse } from "@/service/courseService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const CreateCoursePage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
    reValidateMode: "onSubmit",
  });
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: postCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const onSubmitHandle = async (data) => {
    try {
      await mutateAsync(data);
      setTimeout(() => {
        toast.success("Course berhasil dibuat");
      }, 1500);

      navigate("/dashboard/teacher/courses");
    } catch (error) {
      toast(error.response.data.message);

      if (error.response.status === 401 || error.response.status === 403) {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-10">
      <Link to="/dashboard/teacher/courses">
        <Button variant="outline" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>

      <form onSubmit={handleSubmit(onSubmitHandle)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Buat Course</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Silahkan tambah course
          </p>
        </div>
        <Toaster />
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              placeholder="Masukkan title Course"
              required
              {...register("title")}
            />
            {errors.title && (
              <span className="text-sm text-red-400">
                {errors.title.message}
              </span>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="desc">Deskripsi</Label>
            <textarea
              name="description"
              id="description"
              {...register("description")}
              className="outline rounded-md ps-3 pt-2 placeholder:text-muted-foreground selection:text-primary-foreground text-base md:text-sm resize-none h-28"
              placeholder="Masukkan Deskripsi Course"
            ></textarea>
            {errors.description && (
              <span className="text-sm text-red-400">
                {errors.description.message}
              </span>
            )}
          </div>
          <Button type="submit" className="w-full">
            {isPending ? "Memuat..." : "Buat"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage;
