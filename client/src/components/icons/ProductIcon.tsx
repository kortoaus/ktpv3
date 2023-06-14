import React from "react";
import { IconBaseProps } from "react-icons";
import { MdInventory2 } from "react-icons/md";

export default function ProductIcon({ size, className }: IconBaseProps) {
  return <MdInventory2 size={size} className={className} />;
}
