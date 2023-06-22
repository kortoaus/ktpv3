"use client";
import React from "react";
import DeviceUpdate from "@/screens/DeviceUpdate";
import useSWR from "swr";
import DataLoading from "@/components/ui/DataLoading";
import { TableContainerWithTables } from "@/types/Table";

type Props = {
  searchParams: {
    page: string;
    keyword: number;
  };
};

type ResultProps = {
  ok: boolean;
  result: TableContainerWithTables[];
};

export default function NewDevicePage({ searchParams }: Props) {
  const { data, isLoading } = useSWR<ResultProps>(`/api/table`);
  return (
    <>
      {isLoading && <DataLoading />}
      {data && !data.ok && !isLoading && <div>Server Error!</div>}
      {data && data.ok && !isLoading && (
        <DeviceUpdate tables={data.result} query={searchParams} />
      )}
    </>
  );
}
