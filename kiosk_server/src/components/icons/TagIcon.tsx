import React from "react";
import { IconBaseProps } from "react-icons";
import { MdSell } from "react-icons/md";

export default function TagIcon({ size, className }: IconBaseProps) {
  return <MdSell size={size} className={className} />;
}
