import { cn } from "@heroui/react";

export default function Logo({ className, ...props }) {
  return (
    <img
      src="/toy-house-logo.webp"
      alt="Toy house logo"
      className={cn("size-24 rounded-md border", className)}
      {...props}
    />
  );
}
