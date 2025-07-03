import { z } from "zod";

const courseSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Judulnya kependekan" })
    .max(20, { message: "Judulnya kepanjangan" }),
  description: z
    .string()
    .min(10, { message: "Deskripsinya kependekan" })
    .max(100, { message: "Panjangnya" }),
});

export default courseSchema;
