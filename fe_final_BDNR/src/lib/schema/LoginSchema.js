import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email({ message: "Please use ur valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be between 8 and 16 character" })
    .max(16, { message: "Password must be between 8 and 16 character" }),
});

export default LoginSchema;
