import React from "react";
import { IconBaseProps } from "react-icons";
import { MdReceipt } from "react-icons/md";

export default function ReceiptIcon({ size, className }: IconBaseProps) {
  return <MdReceipt size={size} className={className} />;
}
