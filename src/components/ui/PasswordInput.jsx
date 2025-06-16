import { Input } from "@heroui/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export function PasswordInput(props) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}>
          {isVisible ? (
            <FaEyeSlash className="pointer-events-none size-5 text-default-400" />
          ) : (
            <FaEye className="pointer-events-none size-5 text-default-400" />
          )}
        </button>
      }
      type={isVisible ? "text" : "password"}
      {...props}
    />
  );
}
