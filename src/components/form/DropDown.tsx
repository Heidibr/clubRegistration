import type { SelectHTMLAttributes } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";

type Option = string | { value: string; label: string };

type DropDownProps = {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  options?: Option[];
  placeholder?: string;
  error?: string;
  required?: boolean;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "name" | "value" | "onChange" | "required">;

export function DropDown({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  error,
  required = false,
  ...rest
}: DropDownProps) {
  const items = options.map((opt) =>
    typeof opt === "object" ? opt : { value: opt, label: opt }
  );

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

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          required={required}
          {...rest}
          className={`peer w-full appearance-none cursor-pointer rounded-sm border-2 bg-white px-3 py-2 pr-9 text-navy disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 ${error ? "border-red-600" : "border-navy"}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {items.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-navy peer-disabled:text-gray-400"
        >
          <CaretDownIcon size={32} />
        </span>
      </div>
    </div>
  );
}
