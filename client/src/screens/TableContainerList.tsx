"use client";
import TableContainerListCard from "@/components/TableContainerListCard";
import PlusIcon from "@/components/icons/PlusIcon";
import { TableContainer } from "@/types/model";
import Link from "next/link";
import React from "react";

type Props = {
  list: TableContainer[];
};

export default function TableContainerList({ list }: Props) {
  return (
    <div className="ListContainer max-w-xl mx-auto">
      <div className="ToolbarContainer pb-4 border-b ">
        <Link href="/tcontainer/new">
          <button className="BasicBtn bg-purple-500 text-white border-purple-500">
            <PlusIcon />
            <span>Add New</span>
          </button>
        </Link>
      </div>
      <div className="List">
        {list.map((data) => {
          return <TableContainerListCard key={data.id} data={data} />;
        })}
      </div>
    </div>
  );
}
