import React from "react";
import { IconBaseProps } from "react-icons";
import { MdLogout } from "react-icons/md";

export default function SignOutIcon({ size, className }: IconBaseProps) {
  return <MdLogout size={size} className={className} />;
}
