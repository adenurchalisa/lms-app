import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMaterial } from "@/service/materialService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";

export function EditMaterialForm({ material, courseId, isOpen, onOpenChange }) {
  const [title, setTitle] = useState(material?.title || "");
  const [selectedFile, setSelectedFile] = useState(null);

  const queryClient = useQueryClient();

  // Reset form when material changes or dialog opens
  useEffect(() => {
    if (material) {
      setTitle(material.title);
      setSelectedFile(null);
    }
  }, [material, isOpen]);

  const { mutateAsync: updateMaterialAsync, isPending } = useMutation({
    mutationFn: (data) => updateMaterial(material._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      onOpenChange(false);
      setTitle("");
      setSelectedFile(null);
      toast.success("Material berhasil diupdate");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Gagal mengupdate material");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least title or file is provided
    if (!title.trim() && !selectedFile) {
      toast.error("Minimal isi judul atau pilih file baru");
      return;
    }

    try {
      const formData = new FormData();
      if (title.trim()) {
        formData.append("title", title.trim());
      }
      if (selectedFile) {
        formData.append("content", selectedFile);
      }

      await updateMaterialAsync(formData);
    } catch (error) {
      console.error("Update material error:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Materi</DialogTitle>
          <DialogDescription>
            Update judul atau file materi pembelajaran
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="edit-title">Judul</Label>
              <Input
                id="edit-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masukkan judul materi"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-content">File Baru (Opsional)</Label>
              <Input
                id="edit-content"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p className="text-sm text-gray-600">
                  File terpilih: {selectedFile.name}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Biarkan kosong jika tidak ingin mengubah file
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <Label className="text-sm font-medium">File Saat Ini:</Label>
              <a
                href={material?.content}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline block mt-1"
              >
                Lihat file yang sedang aktif
              </a>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Mengupdate..." : "Update Materi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
