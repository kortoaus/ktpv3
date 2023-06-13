"use client";

import CategoryListCard from "@/components/CategoryListCard";
import PlusIcon from "@/components/icons/PlusIcon";
import { CategoryWithProductCount } from "@/types/Product";
import { PagingProps } from "@/types/api";
import Link from "next/link";
import React from "react";

type Props = {
  list: CategoryWithProductCount[];
  paging: PagingProps;
};

export default function CategoryList({ list, paging }: Props) {
  return (
    <div className="List">
      {list.map((data) => {
        return <CategoryListCard paging={paging} key={data.id} data={data} />;
      })}
    </div>
  );
}
