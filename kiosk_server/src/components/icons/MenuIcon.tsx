import React from "react";
import { IconBaseProps } from "react-icons";
import { MdMenu } from "react-icons/md";

export default function MenuIcon({ size, className }: IconBaseProps) {
  return <MdMenu size={size} className={className} />;
}
