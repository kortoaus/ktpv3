import React from "react";
import Required from "./Required";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
  register: UseFormRegisterReturn;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: FieldError;
};

export default function IntInput({
  register,
  label = "",
  required,
  disabled,
  placeholder = "",
  error,
}: Props) {
  return (
    <div className="form-element-group">
      {label && (
        <label>
          {label}
          {required && <Required />}
        </label>
      )}
      <input
        type="number"
        step={0}
        {...register}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error?.message && <p className="err">{error.message}</p>}
    </div>
  );
}
