import React from "react";
import { IconBaseProps } from "react-icons";
import { MdArrowBackIosNew } from "react-icons/md";

export default function BackIcon({ size, className }: IconBaseProps) {
  return <MdArrowBackIosNew size={size} className={className} />;
}
