import React from "react";
import { IconBaseProps } from "react-icons";
import { MdCheckBoxOutlineBlank } from "react-icons/md";

export default function UncheckedIcon({ size, className }: IconBaseProps) {
  return <MdCheckBoxOutlineBlank size={size} className={className} />;
}
