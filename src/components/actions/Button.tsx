import type { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  buttonText: string;
  isBlue?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ type = "button", buttonText, isBlue, disabled, className = "", ...rest }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      type={type}
      className={`py-2 px-4 cursor-pointer rounded-sm text-cream disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:bg-gray-300 ${isBlue ? "bg-navy hover:bg-steel " : "bg-brown hover:bg-caramel"} ${className}`}
      {...rest}
    >
      {buttonText}
    </button>
  );
}
