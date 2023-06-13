"use client";
import { ApiResultType } from "@/types/api";
import { Category, Product } from "@/types/model";
import React, { useEffect, useState } from "react";
import DataLoading from "@/components/ui/DataLoading";
import ProductUpdate from "@/screens/ProductUpdate";
import useSWR from "swr";
import { ProductOption } from "@/types/Product";

type ResultProps = ApiResultType & {
  result?: Product;
};

type OptionProps = ApiResultType & {
  result: ProductOption;
};

type Props = {
  params: {
    id: string;
  };
};

export default function ProductDetailPage({ params: { id } }: Props) {
  const { data: optionData, isLoading } =
    useSWR<OptionProps>(`/api/product/option`);
  const [data, setData] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch(`/api/product/${id}`)
        .then((res) => res.json())
        .then((data) => data)
        .finally(() => setLoading(false));

      if (ok && result) {
        setData(result);
        return;
      }

      if (!ok && msg) {
        setErr(msg);
      }
      setData(undefined);
      return;
    };

    getData();
  }, [id]);

  return (
    <main className="">
      {(loading || isLoading) && <DataLoading />}
      {err && <div className="h-full fccc text-red-500">{err}</div>}
      {!loading && !isLoading && data && optionData && (
        <ProductUpdate data={data} option={optionData.result} />
      )}
    </main>
  );
}
