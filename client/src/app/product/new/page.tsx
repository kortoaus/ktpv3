"use client";
import ProductUpdate from "@/screens/ProductUpdate";
import DataLoading from "@/components/ui/DataLoading";
import { ProductOption } from "@/types/Product";
import { ApiResultType } from "@/types/api";
import React from "react";
import useSWR from "swr";

type ResultProps = ApiResultType & {
  result: ProductOption;
};

type Props = {
  searchParams: {
    page: string;
    keyword: number;
  };
};

export default function NewProductPage({
  searchParams: { keyword, page },
}: Props) {
  const { data, isLoading } = useSWR<ResultProps>(`/api/product/option`);

  return (
    <main className="pb-16">
      {isLoading ? (
        <DataLoading />
      ) : (
        <>
          {data && data.ok && (
            <ProductUpdate query={{ keyword, page }} option={data.result} />
          )}
        </>
      )}
    </main>
  );
}
