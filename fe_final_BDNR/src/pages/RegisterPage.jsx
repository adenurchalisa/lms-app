import { RegisterForm } from "@/components/RegisterForm";
import RegisterSchema from "@/lib/schema/RegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Facebook } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

const RegisterPage = () => {
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    reValidateMode: "onSubmit",
  });
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Facebook className="size-4" />
            </div>
            Acme Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <FormProvider {...form}>
              <RegisterForm />
            </FormProvider>
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default RegisterPage;
