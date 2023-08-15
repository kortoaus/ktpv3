"use client";
import { PagingProps } from "@/types/api";
import { CashIO } from "@/types/model";
import React from "react";

type Props = {
  list: CashIO[];
  paging: PagingProps;
};

export default function CashIOList({ list, paging }: Props) {
  return (
    <div className="List">
      {list.map((data) => {
        return <ListCard paging={paging} key={data.id} data={data} />;
      })}
    </div>
  );
}

import { time } from "@/libs/util";

type CardProps = {
  data: CashIO;
  paging: PagingProps;
};

function ListCard({
  data: { createdAt, staff, cashIn, cashOut, note },
}: CardProps) {
  return (
    <div className="grid grid-cols-12 border-b py-4 gap-2">
      <div className="col-span-2 text-sm">
        <div>{time(createdAt).format("YY-MM-DD")}</div>
        <div>{time(createdAt).format("HH:mm")}</div>
      </div>

      <div className="col-span-6 break-all">
        <div>{staff}</div>
        <div className="text-xs text-gray-500">{note}</div>
      </div>

      <div className="col-span-2 text-right text-blue-500">{`+${cashIn.toFixed(
        2
      )}`}</div>
      <div className="col-span-2 text-right text-red-500">{`-${cashOut.toFixed(
        2
      )}`}</div>
    </div>
  );
}
