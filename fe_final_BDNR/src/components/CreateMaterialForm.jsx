import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import materialSchema from "@/lib/schema/materialSchema";
import { postMaterialCourse } from "@/service/materialService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function CreateMaterialForm({ courseId }) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(materialSchema),
    reValidateMode: "onSubmit",
  });

  const queryClient = useQueryClient();
  const watchedContent = watch("content");

  // Update selected file when file input changes
  useEffect(() => {
    if (watchedContent && watchedContent.length > 0) {
      setSelectedFile(watchedContent[0]);
    } else {
      setSelectedFile(null);
    }
  }, [watchedContent]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data) => postMaterialCourse(data, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      setOpen(false);
      reset();
      setSelectedFile(null); // Reset selected file
      toast.success("Material berhasil dibuat");
    },
  });

  const onSubmitHandle = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content[0]); // File from input

      await mutateAsync(formData);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membuat material");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Materi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buat Materi</DialogTitle>
          <DialogDescription>Masukkan Materi</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitHandle)}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" type="text" {...register("title")} required />
              {errors.title && (
                <span className="text-sm text-red-400">
                  {errors.title.message}
                </span>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="content">Content</Label>
              <Input
                id="content"
                type="file"
                accept="application/pdf"
                {...register("content")}
              />
              {errors.content && (
                <span className="text-sm text-red-400">
                  {errors.content.message}
                </span>
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Memuat..." : "Buat Materi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
