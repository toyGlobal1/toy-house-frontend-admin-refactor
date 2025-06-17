import { useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-3 text-3xl font-bold">Something went wrong!</h1>
        <p>An unexpected error has occurred.</p>
        <p className="text-xl font-medium italic text-danger">
          {error?.statusText || error?.message}
        </p>
      </div>
    </div>
  );
}
