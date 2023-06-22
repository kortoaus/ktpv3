import React from "react";
import { IconBaseProps } from "react-icons";
import { MdSearch } from "react-icons/md";

export default function SearchIcon({ size, className }: IconBaseProps) {
  return <MdSearch size={size} className={className} />;
}
