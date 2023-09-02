import React from "react";
import { IconBaseProps } from "react-icons";
import { MdAttachMoney, MdPercent } from "react-icons/md";

export default function DollarIcon({ size, className }: IconBaseProps) {
  return <MdAttachMoney size={size} className={className} />;
}

export function PercentIcon({ size, className }: IconBaseProps) {
  return <MdPercent size={size} className={className} />;
}
