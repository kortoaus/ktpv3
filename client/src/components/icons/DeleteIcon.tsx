import React from "react";
import { IconBaseProps } from "react-icons";
import { MdDeleteOutline } from "react-icons/md";

export default function DeleteIcon({ size, className }: IconBaseProps) {
  return <MdDeleteOutline size={size} className={className} />;
}
