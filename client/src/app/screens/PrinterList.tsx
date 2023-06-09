"use client";

import PrinterListCard from "@/components/PrinterListCard";
import PlusIcon from "@/components/icons/PlusIcon";
import { Printer } from "@/types/model";
import Link from "next/link";
import React from "react";

type Props = {
  list: Printer[];
};

export default function PrinterList({ list }: Props) {
  return (
    <div className="ListContainer max-w-xl mx-auto">
      <div className="ToolbarContainer pb-4 border-b ">
        <Link href="/printer/new">
          <button className="BasicBtn bg-purple-500 text-white border-purple-500">
            <PlusIcon />
            <span>Add New</span>
          </button>
        </Link>
      </div>
      <div className="List">
        {list.map((data) => {
          return <PrinterListCard key={data.id} data={data} />;
        })}
      </div>
    </div>
  );
}
