import { Spinner } from "@heroui/react";

export function LoadingScreen() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner label="Loading" />
    </div>
  );
}
