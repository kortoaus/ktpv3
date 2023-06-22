import React from "react";
import { IconBaseProps } from "react-icons";
import { MdPayments } from "react-icons/md";

export default function PaymentIcon({ size, className }: IconBaseProps) {
  return <MdPayments size={size} className={className} />;
}
