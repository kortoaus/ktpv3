import { SaleLineType } from "@/types/Sale";
import { PopUpProps } from "@/types/api";
import { Drawer } from "@mui/material";
import React from "react";
import ReceiptLineCard from "../ReceiptLineCard";

export default function BillDrawer({
  open,
  onClose,
  lines,
  total,
}: PopUpProps & { total: number; lines: SaleLineType[] }) {
  return (
    <Drawer anchor="right" open={open} onClose={() => onClose()}>
      <div className="max-w-xs p-2 pt-0 relative">
        <div className="sticky top-0 bg-white pt-2">
          <div className="f-btw pb-2 border-b ">
            <h3>Current Bill</h3>
            <button
              onClick={() => onClose()}
              className="BasicBtn !border-0 bg-red-500 text-white"
            >
              Close
            </button>
          </div>
          <div className="bg-blue-500 text-white text-center font-medium border-b py-2 mb-2">{`Sub Total: $${total.toFixed(
            2
          )}`}</div>
        </div>
        {lines.map((line) => (
          <ReceiptLineCard
            line={line}
            key={`bill_${line.id}`}
            remove={() => null}
          />
        ))}
      </div>
    </Drawer>
  );
}
