import { z } from "zod";

const RegisterSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be between 8 and 16 character" })
      .max(16, { message: "Password must be between 8 and 16 character" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be between 8 and 16 character" })
      .max(16, { message: "Password must be between 8 and 16 character" }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password must be match",
    path: ["confirmPassword"],
  });

export default RegisterSchema;
