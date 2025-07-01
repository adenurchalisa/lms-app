import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router";
import { useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authRegister } from "@/service/authService";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

export const RegisterForm = ({ className, ...props }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: authRegister,
  });

  const onSubmitHandle = async (data) => {
    try {
      await mutateAsync(data);

      navigate("/login");
    } catch (error) {
      toast.error("Kesalahan terjadi", {
        description: error.response.data.message,
      });
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSubmitHandle)}
    >
      <Toaster />
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create Your Own account</h1>
        <p className="text-muted-foreground text-sm ">
          Enter your email below to register your own account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            {...register("email")}
          />
          {errors.email && (
            <span className="text-sm text-red-400">{errors.email.message}</span>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            {...register("password")}
          />
          {errors.password && (
            <span className="text-sm text-red-400">
              {errors.password.message}
            </span>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-sm text-red-400">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Memuat..." : "Register"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?
        <Link href="register" className="underline underline-offset-4">
          Sign In
        </Link>
      </div>
    </form>
  );
};
