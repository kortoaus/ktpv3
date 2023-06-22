import React from "react";
import { IconBaseProps } from "react-icons";
import { MdPrint } from "react-icons/md";

export default function PrinterIcon({ size, className }: IconBaseProps) {
  return <MdPrint size={size} className={className} />;
}
