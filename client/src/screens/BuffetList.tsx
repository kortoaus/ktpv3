"use client";

import BuffetListCard from "@/components/BuffetListCard";
import PlusIcon from "@/components/icons/PlusIcon";
import { BuffetClass } from "@/types/model";
import Link from "next/link";
import React from "react";

type Props = {
  list: BuffetClass[];
};

export default function BuffetList({ list }: Props) {
  return (
    <div className="ListContainer max-w-md mx-auto">
      <div className="ToolbarContainer pb-4">
        <Link href="/buffet/new">
          <button className="BasicBtn bg-purple-500 text-white border-purple-500">
            <PlusIcon />
            <span>Add New</span>
          </button>
        </Link>
      </div>
      <div className="List">
        {list.map((data) => {
          return <BuffetListCard key={data.id} data={data} />;
        })}
      </div>
    </div>
  );
}
