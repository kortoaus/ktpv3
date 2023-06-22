import React from "react";
import { IconBaseProps } from "react-icons";
import { MdCheckBox } from "react-icons/md";

export default function CheckedIcon({ size, className }: IconBaseProps) {
  return <MdCheckBox size={size} className={className} />;
}
