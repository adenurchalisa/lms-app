import { z } from "zod";

const materialSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title minimal 5 karakter" })
    .max(100, { message: "Title maksimal 100 karakter" }),
  content: z
    .any()
    .refine((files) => {
      return files?.length > 0;
    }, "File wajib diupload")
    .refine((files) => {
      const file = files?.[0];
      return file?.size <= 10 * 1024 * 1024; // 10MB limit
    }, "File maksimal 10MB")
    .refine((files) => {
      const file = files?.[0];
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      return allowedTypes.includes(file?.type);
    }, "File harus berupa PDF, DOC, DOCX, atau TXT"),
});

export default materialSchema;
