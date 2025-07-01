import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";
import { useFormContext } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authLogin } from "@/service/authService";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";

export function LoginForm({ className, ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: authLogin,
  });

  const onSubmitHandle = async (data) => {
    try {
      const response = await mutateAsync(data);
      localStorage.setItem("credentials", JSON.stringify(response.data));

      navigate("/");
    } catch (error) {
      toast.error("Terjadi Kesalahan", {
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
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
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
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
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
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Memuat..." : "Login"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
