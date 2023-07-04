import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  id: string;
  label?: string;
};

type ToggleCheckBoxProps = Props & {
  register: UseFormRegisterReturn;
  disabled?: boolean;
};

export default function ToggleCheckbox({
  id,
  register,
  label = "",
  disabled = false,
}: ToggleCheckBoxProps) {
  return (
    <div className="form-element-group">
      <div className="flex items-center gap-2">
        <input id={id} type="checkbox" {...register} disabled={disabled} />
        <label htmlFor={id} className="!mb-0">
          {label}
        </label>
      </div>
    </div>
  );
}

type MultipleCheckboxProps = Props & {
  value: number;
  checked: boolean;
  onChange: (val: number) => void;
  disabled?: boolean;
};

export function MultipleCheckbox({
  id,
  label = "",
  value,
  onChange,
  checked,
  disabled = false,
}: MultipleCheckboxProps) {
  return (
    <div className="form-element-group">
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          name={id}
          onChange={(e) => onChange(value)}
          disabled={disabled}
        />
        <label htmlFor={id} className="!mb-0">
          {label}
        </label>
      </div>
    </div>
  );
}

type HandlerCheckboxProps = Props & {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function HandlerCheckbox({
  id,
  label = "",
  onChange,
  checked,
}: HandlerCheckboxProps) {
  return (
    <div className="form-element-group">
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          name={id}
          onChange={(e) => onChange(e)}
        />
        <label htmlFor={id} className="!mb-0">
          {label}
        </label>
      </div>
    </div>
  );
}
