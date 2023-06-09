import { Printer } from "@/types/model";
import Link from "next/link";
import React from "react";
import StarIcon from "./icons/StarIcon";
import PaymentIcon from "./icons/PaymentIcon";
import ReceiptIcon from "./icons/ReceiptIcon";

type Props = {
  data: Printer;
};

export default function PrinterListCard({
  data: { id, label, ip, port, isMain, hasDrawer, isSplit },
}: Props) {
  return (
    <div className="grid grid-cols-12 border-b py-4">
      <div className="col-span-6 flex items-center justify-start">
        <Link href={`/printer/${id}`} prefetch={false}>
          <div className="font-medium">{label}</div>
          <div className="text-sm text-gray-500">{`${ip}:${port}`}</div>
        </Link>
      </div>
      <div className="col-span-4 flex items-center justify-start gap-6">
        {isMain && (
          <div className="fccc gap-1">
            <StarIcon size={18} className="text-green-500" />
            <span className="text-xs text-gray-500">Main</span>
          </div>
        )}
        {hasDrawer && (
          <div className="fccc gap-1">
            <PaymentIcon size={18} className="text-green-500" />
            <span className="text-xs text-gray-500">Drawer</span>
          </div>
        )}
        {isSplit && (
          <div className="fccc gap-1">
            <ReceiptIcon size={18} className="text-green-500" />
            <span className="text-xs text-gray-500">Split</span>
          </div>
        )}
      </div>
      <div className="col-span-2 fccc text-blue-500">
        <Link href={`/printer/${id}`} prefetch={false}>
          Update
        </Link>
      </div>
    </div>
  );
}
