import React from "react";
import Required from "./Required";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import DollarIcon from "@/components/icons/DollarIcon";

type DefaultProps = {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: FieldError;
};

type Props = DefaultProps & {
  register: UseFormRegisterReturn;
};

export default function PriceInput({
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
      <div className="relative">
        <input
          type="number"
          className="text-right w-full"
          min={0}
          step={0.01}
          {...register}
          placeholder={placeholder}
          disabled={disabled}
        />
        <div className="absolute top-0 h-full fccc w-8 text-gray-500">
          <DollarIcon size={18} />
        </div>
      </div>
      {error?.message && <p className="err">{error.message}</p>}
    </div>
  );
}

type BuffetProps = DefaultProps & {
  value: number;
  onChange: (val: number) => void;
};

export function BuffetPriceInput({
  label = "",
  required,
  disabled,
  placeholder = "",
  error,
  value,
  onChange,
}: BuffetProps) {
  return (
    <div className="form-element-group">
      {label && (
        <label>
          {label}
          {required && <Required />}
        </label>
      )}
      <div className="relative">
        <input
          type="number"
          className="text-right w-full"
          min={0}
          step={0.01}
          value={value}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!isNaN(val)) {
              onChange(val);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
        />
        <div className="absolute top-0 h-full fccc w-8 text-gray-500">
          <DollarIcon size={18} />
        </div>
      </div>
      {error?.message && <p className="err">{error.message}</p>}
    </div>
  );
}
