import React from "react";
import { ChevronDown } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface BaseFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  disabled: boolean;
  required?: boolean;
  error?: string;
  className?: string;
}

interface RegisteredTextFieldProps extends BaseFieldProps {
  placeholder: string;
}

interface RegisteredSelectFieldProps extends BaseFieldProps {
  placeholder: string;
  options: string[];
}

const inputStateClasses = (hasError: boolean) =>
  hasError
    ? "border-error focus:border-error focus:ring-2 focus:ring-error/15"
    : "border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/15";

const FieldShell: React.FC<
  Pick<BaseFieldProps, "label" | "registration" | "required" | "error" | "className"> & {
    children: React.ReactNode;
  }
> = ({ label, registration, required = false, error, className = "", children }) => (
  <div className={`space-y-1.5 ${className}`}>
    <label
      htmlFor={registration.name}
      className="block text-body-sm font-semibold text-on-surface"
    >
      {label}
      {required && <span className="text-error ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-xs font-medium text-error">{error}</p>}
  </div>
);

export const RegisteredTextField: React.FC<RegisteredTextFieldProps> = ({
  label,
  registration,
  placeholder,
  disabled,
  required,
  error,
  className,
}) => (
  <FieldShell
    label={label}
    registration={registration}
    required={required}
    error={error}
    className={className}
  >
    <input
      id={registration.name}
      {...registration}
      disabled={disabled}
      aria-invalid={Boolean(error)}
      className={`w-full h-11 rounded-lg border bg-surface-container-lowest px-3.5 text-body-sm text-on-surface outline-none transition-all duration-200 placeholder:text-outline disabled:opacity-60 disabled:cursor-not-allowed ${inputStateClasses(
        Boolean(error),
      )}`}
      placeholder={placeholder}
    />
  </FieldShell>
);

export const RegisteredSelectField: React.FC<RegisteredSelectFieldProps> = ({
  label,
  registration,
  placeholder,
  options,
  disabled,
  required,
  error,
  className,
}) => (
  <FieldShell
    label={label}
    registration={registration}
    required={required}
    error={error}
    className={className}
  >
    <div className="relative">
      <select
        id={registration.name}
        {...registration}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={`w-full h-11 rounded-lg border bg-surface-container-lowest pl-3.5 pr-10 text-body-sm text-on-surface outline-none transition-all duration-200 appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${inputStateClasses(
          Boolean(error),
        )}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
    </div>
  </FieldShell>
);
