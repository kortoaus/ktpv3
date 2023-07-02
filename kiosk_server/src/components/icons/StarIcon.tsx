import React from "react";
import { IconBaseProps } from "react-icons";
import { MdStar } from "react-icons/md";

export default function StarIcon({ size, className }: IconBaseProps) {
  return <MdStar size={size} className={className} />;
}
