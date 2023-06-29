import Link from "next/link";
import React from "react";
import { PagingProps } from "@/types/api";
import { Sale } from "@/types/model";
import { time } from "@/libs/util";
import Decimal from "decimal.js";

type Props = {
  data: Sale;
  paging: PagingProps;
};

export default function ReceiptListCard({
  data: { id, shiftId, closedAt, total, creditPaid, cashPaid },
  paging,
}: Props) {
  const { current, keyword } = paging;

  const paidTotal = new Decimal(creditPaid).plus(cashPaid).toFixed(2);

  if (!closedAt) {
    return null;
  }

  return (
    <div className="grid grid-cols-12 border-b py-4">
      <div className="col-span-6 flex items-center justify-start">
        <Link
          href={`/receipt/${id}?page=${current}&keyword=${keyword}`}
          prefetch={false}
        >
          <div className="">
            <div>{time(closedAt).format("YY-MM-DD HH:mm")}</div>
            <div className="text-xs">{`${shiftId}/${id}`}</div>
          </div>
        </Link>
      </div>

      <div className="col-span-2 flex items-center justify-start">
        <Link
          href={`/receipt/${id}?page=${current}&keyword=${keyword}`}
          prefetch={false}
        >
          <div className="">{`$${paidTotal}`}</div>
        </Link>
      </div>
    </div>
  );
}
