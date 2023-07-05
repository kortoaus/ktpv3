import { PopUpProps } from "@/types/api";
import { Drawer } from "@mui/material";
import Link from "next/link";
import React from "react";

export default function Sidebar({ open, onClose }: PopUpProps) {
  return (
    <Drawer className="" anchor="right" open={open} onClose={() => onClose()}>
      <div className="Sidebar">
        <Link href="/">
          <h2>Home</h2>
        </Link>
        <Link href="/menu">
          <h2>Menu</h2>
        </Link>
      </div>
    </Drawer>
  );
}
