import React from "react";
import { IconBaseProps } from "react-icons";
import { MdTimelapse } from "react-icons/md";

export default function TimerIcon({ size, className }: IconBaseProps) {
  return <MdTimelapse size={size} className={className} />;
}
