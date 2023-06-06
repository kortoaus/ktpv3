"use client";

import CategoryListCard from "@/components/CategoryListCard";
import PlusIcon from "@/components/icons/PlusIcon";
import { CategoryWithProductCount } from "@/types/Product";
import Link from "next/link";
import React from "react";

type Props = {
  list: CategoryWithProductCount[];
};

export default function CategoryList({ list }: Props) {
  return (
    <div className="ListContainer max-w-xl">
      <div className="ToolbarContainer pb-4 border-b ">
        <Link href="/category/new">
          <button className="BasicBtn bg-purple-500 text-white border-purple-500">
            <PlusIcon />
            <span>Add New</span>
          </button>
        </Link>
      </div>
      <div className="List">
        {list.map((data) => {
          return <CategoryListCard key={data.id} data={data} />;
        })}
      </div>
    </div>
  );
}
