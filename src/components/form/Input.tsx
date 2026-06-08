import type { InputHTMLAttributes } from "react";

type InputProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (name: string, value: string) => void;
  error?: string;
  required?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "type" | "value" | "onChange" | "required">;

export function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  ...rest
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col sm:flex-row sm:gap-2">
        <label htmlFor={name}>
          {label}
          {required && error && (
            <span aria-hidden="true" className="text-red-600"> *</span>
          )}
        </label>
        {error && (
          <p id={`${name}-error`} className="text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>

      <input
        data-testid={"input"+name}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        required={required}
        {...rest}
        className={`w-full bg-white border-2 rounded-sm px-3 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300   ${error ? "border-red-600" : "border-navy"}`}
      />
    </div>
  );
}
