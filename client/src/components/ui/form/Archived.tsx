import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  register: UseFormRegisterReturn;
  label?: string;
};

export default function Archived({ register, label = "Archived" }: Props) {
  return (
    <div className="form-element-group">
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register} />
        <label className="text-red-500 !mb-0">{label}</label>
      </div>
    </div>
  );
}
