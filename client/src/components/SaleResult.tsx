import { ReceivedLine } from "@/screens/ReceiptDetail";
import { ShiftResultType } from "@/types/Shift";
import React from "react";

type Props = {
  openCash: number;
  data: ShiftResultType;
};

export default function SaleResult({ openCash, data }: Props) {
  const {
    ppA,
    ppB,
    ppC,
    pp,
    subTotal,
    charged,
    total,
    credit,
    creditSurcharge,
    cashIn,
    cashOut,
    creditPaid,
    cashPaid,
    discount,
    c_ms,
    c_fs,
    c_my,
    c_fy,
    c_mm,
    c_fm,
    tables,
  } = data;
  return (
    <div>
      <ReceivedLine label="Cash at Opened" value={openCash} negative={false} />
      <ReceivedLine
        label="Cash Out"
        value={cashOut}
        negative={true}
        accent="text-red-500"
      />
      <ReceivedLine label="Cash In" value={cashIn} negative={false} />

      <ReceivedLine label="Sub Total" value={subTotal} />
      <ReceivedLine label="Surcharge" value={charged} />
      <ReceivedLine
        label="Discount"
        value={discount}
        negative={true}
        accent="text-red-500"
      />
      <ReceivedLine label="Total" value={total} accent="font-medium" />
      <ReceivedLine label="Credit" value={credit} />
      <ReceivedLine label="Credit Surcharge" value={creditSurcharge} />
      <ReceivedLine
        label="Paid Credit"
        value={creditPaid}
        accent="text-blue-500"
      />

      <ReceivedLine label="Paid Cash" value={cashPaid} accent="text-blue-500" />
      <ReceivedLine
        label="Paid Total"
        value={creditPaid + cashPaid}
        accent="text-blue-500"
      />
    </div>
  );
}
