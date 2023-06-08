"use client";
import ProductUpdate from "@/app/screens/ProductUpdate";
import DataLoading from "@/components/ui/DataLoading";
import { ProductOption } from "@/types/Product";
import { ApiResultType } from "@/types/api";
import React from "react";
import useSWR from "swr";

type ResultProps = ApiResultType & {
  result: ProductOption;
};

export default function NewProductPage() {
  const { data, isLoading } = useSWR<ResultProps>(`/api/product/option`);

  return (
    <main className="py-16">
      {isLoading ? (
        <DataLoading />
      ) : (
        <>{data && data.ok && <ProductUpdate option={data.result} />}</>
      )}
    </main>
  );
}
