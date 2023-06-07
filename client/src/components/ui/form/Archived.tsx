import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  register: UseFormRegisterReturn;
  label?: string;
};

export default function Archived({ register, label = "" }: Props) {
  return (
    <div className="form-element-group">
      <label className="text-red-500">{label}</label>
      <input type="checkbox" {...register} />
    </div>
  );
}
