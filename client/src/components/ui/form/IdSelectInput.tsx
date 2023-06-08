import React from "react";
import Required from "./Required";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import Link from "next/link";

type OptionType = {
  name: string;
  value: number;
};

type AddProps = {
  label: string;
  href: string;
};

type Props = {
  register: UseFormRegisterReturn;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: FieldError;
  options?: OptionType[];
  add?: AddProps;
};

export default function IdSelectInput({
  register,
  label = "",
  required,
  disabled,
  placeholder = "",
  error,
  options = [],
  add,
}: Props) {
  return (
    <div className="form-element-group">
      <div className="mb-1 flex items-center justify-between">
        <label className="!mb-0">
          <div>
            {label}
            {required && <Required />}
          </div>
        </label>
        {add !== undefined && (
          <Link
            href={add.href}
            target="_blank"
            prefetch={false}
            className="text-blue-500 text-sm"
          >
            {add.label}
          </Link>
        )}
      </div>
      <select {...register} placeholder={placeholder} disabled={disabled}>
        <option value={0}>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.name}
          </option>
        ))}
      </select>
      {error?.message && <p className="err">{error.message}</p>}
    </div>
  );
}
