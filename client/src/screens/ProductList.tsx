"use client";
import ProductListCard from "@/components/ProductListCard";
import { PagingProps } from "@/types/api";
import { Product } from "@/types/model";
import React from "react";

type Props = {
  list: Product[];
  paging: PagingProps;
};

export default function ProductList({ paging, list }: Props) {
  return (
    <div className="List">
      {list.map((data) => {
        return <ProductListCard paging={paging} data={data} key={data.id} />;
      })}
    </div>
  );
}
