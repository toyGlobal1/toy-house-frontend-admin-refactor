import { addToast, Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { setAuthToken } from "../../lib/auth-token.util";
import { login } from "../../service/auth.service";
import { loginZodSchema } from "../../validations/auth.schema";
import { PasswordInput } from "../ui/PasswordInput";

export function LoginForm() {
  const { setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(loginZodSchema),
    defaultValues: { username: "", password: "" },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const accessToken = data?.accessToken;
      setAuthToken(accessToken);
      setIsAuthenticated(true);
      navigate("/dashboard");
      addToast({
        title: "Success",
        description: "Login successful",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error",
        description: "Failed to login!",
        color: "danger",
      });
    },
  });

  const onSubmit = async (data) => {
    await mutateAsync(data);
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="username"
        render={({ field, fieldState: { error, invalid } }) => (
          <Input
            {...field}
            label="Username"
            placeholder="Enter your username"
            variant="bordered"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field, fieldState: { error, invalid } }) => (
          <PasswordInput
            {...field}
            label="Password"
            placeholder="Enter your password"
            variant="bordered"
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Button
        type="submit"
        isLoading={isPending}
        isDisabled={isPending}
        className="w-full font-medium uppercase">
        Login
      </Button>
    </form>
  );
}
