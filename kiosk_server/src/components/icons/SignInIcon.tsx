import React from "react";
import { IconBaseProps } from "react-icons";
import { MdLogin } from "react-icons/md";

export default function SignInIcon({ size, className }: IconBaseProps) {
  return <MdLogin size={size} className={className} />;
}
