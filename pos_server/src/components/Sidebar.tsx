import { PopUpProps } from "@/types/api";
import { Drawer } from "@mui/material";
import React from "react";

export default function Sidebar({ open, onClose }: PopUpProps) {
  return (
    <Drawer className="" anchor="right" open={open} onClose={() => onClose()}>
      <div>Sidebar</div>
    </Drawer>
  );
}
