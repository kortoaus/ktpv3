"use client";
import ReceiptListCard from "@/components/SaleListCard";
import { PagingProps } from "@/types/api";
import { Sale } from "@/types/model";
import React from "react";

type Props = {
  list: Sale[];
  paging: PagingProps;
};

export default function ReceiptList({ list, paging }: Props) {
  return (
    <div className="List">
      {list.map((data) => {
        return <ReceiptListCard paging={paging} key={data.id} data={data} />;
      })}
    </div>
  );
}
