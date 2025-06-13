import { Card, CardBody, CardHeader } from "@heroui/react";
import Logo from "../components/Logo";
import { LoginForm } from "../components/auth/LoginForm";

export default function HomePage() {
  return (
    <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-2 place-content-center">
      <div className="flex flex-col items-center justify-center">
        <Logo className="w-32" />
        <h1 className="mt-5 text-4xl">ToyHouse Admin Panel</h1>
      </div>
      <Card className="max-w-md divide-y-1 p-3">
        <CardHeader className="flex-col justify-center gap-1">
          <h3 className="text-2xl font-medium">Login</h3>
          <p className="text-sm text-default-500">Welcome back! Please login to your account.</p>
        </CardHeader>
        <CardBody>
          <LoginForm />
        </CardBody>
      </Card>
    </div>
  );
}
