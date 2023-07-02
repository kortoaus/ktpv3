"use client";
import DataLoading from "@/components/ui/DataLoading";
import MenuScreen from "@/screens/MenuScreen";
import { Catalogue } from "@/types/Product";
import { ApiResultType } from "@/types/api";
import React from "react";
import useSWR from "swr";

type SWRProps = ApiResultType & {
  result: Catalogue[];
};

export default function MenuPage() {
  const { data, isLoading, mutate } = useSWR<SWRProps>("/api/product");
  return (
    <div>
      {isLoading && <DataLoading />}
      {!isLoading && data && data.ok && (
        <MenuScreen catalogue={data.result} refresh={() => mutate()} />
      )}
    </div>
  );
}
