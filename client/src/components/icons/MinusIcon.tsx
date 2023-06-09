import React from "react";
import { IconBaseProps } from "react-icons";
import { MdRemoveCircle } from "react-icons/md";

export default function MinusIcon({ size, className }: IconBaseProps) {
  return <MdRemoveCircle size={size} className={className} />;
}
