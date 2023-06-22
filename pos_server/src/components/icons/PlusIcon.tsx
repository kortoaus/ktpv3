import React from "react";
import { IconBaseProps } from "react-icons";
import { MdAddCircle } from "react-icons/md";

export default function PlusIcon({ size, className }: IconBaseProps) {
  return <MdAddCircle size={size} className={className} />;
}
