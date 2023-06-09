"use client";
import TablePlaceHolderCard, {
  TableExistCard,
} from "@/components/TablePlaceHolderCard";
import BackIcon from "@/components/icons/BackIcon";
import { TableContainerWithTables } from "@/types/Table";
import Link from "next/link";
import React from "react";

type Props = {
  data: TableContainerWithTables;
};

export default function TableManager({ data: { id, name, tables } }: Props) {
  const placeholder = Array(100).fill(0);

  return (
    <div className="TableManagerContainer h-full relative w-full overflow-y-scroll">
      {/* Header */}
      <div className="h-14 bg-white z-20 border-b w-full sticky top-0">
        <div className="w-full h-full flex items-center p-2 px-8 gap-4">
          <Link href="/tcontainer">
            <button className="BasicBtn bg-blue-500 text-white border-blue-500">
              <BackIcon />
              <span className="text-sm">Go Back</span>
            </button>
          </Link>
          <h1>{name}</h1>
        </div>
      </div>

      {/* Tables */}
      <div className="p-8 pb-16">
        <div className="w-full grid grid-cols-10 gap-2">
          {placeholder.map((_, idx) => {
            const table = tables.find((tb) => tb.index === idx + 1);

            return (
              <Link key={idx} href={`/tcontainer/${id}/table/${idx + 1}`}>
                {table ? (
                  <TableExistCard table={table.name} />
                ) : (
                  <TablePlaceHolderCard />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
