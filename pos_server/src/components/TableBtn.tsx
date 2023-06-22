"use client";
import { time } from "@/libs/util";
import { TableWithSales } from "@/types/Table";
import { Table } from "@/types/model";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  table?: TableWithSales;
};

export default function TableLinkBtn({ table }: Props) {
  if (!table) {
    return (
      <div className="border rounded-md h-14 w-full p-2 fccc overflow-hidden opacity-25"></div>
    );
  }

  const { id, name, sale } = table;

  let stay = "";

  if (sale) {
    stay = time(new Date()).diff(sale.openAt, "minutes") + " Mins";
  }

  return (
    <Link prefetch={false} href={`/table/${id}`}>
      <button
        className={`border rounded-md h-14 w-full p-2 fccc overflow-hidden ${
          sale ? "bg-blue-500 text-white" : ""
        }`}
      >
        <div className="text-sm">{name}</div>
        {sale && (
          <>
            <div className="text-xs">
              <span>{`$${sale.total.toFixed(2)}(${sale.pp})`}</span>
              {sale.buffetId && <span className="text-blue-500">*</span>}
              {stay && <div>{stay}</div>}
            </div>
          </>
        )}
      </button>
    </Link>
  );
}
