"use client";

import PrinterListCard from "@/components/PrinterListCard";
import { PagingProps } from "@/types/api";
import { Printer } from "@/types/model";
import React from "react";

type Props = {
  list: Printer[];
  paging: PagingProps;
};

export default function PrinterList({ list, paging }: Props) {
  return (
    <div className="List">
      {list.map((data) => {
        return <PrinterListCard paging={paging} key={data.id} data={data} />;
      })}
    </div>
  );
}
