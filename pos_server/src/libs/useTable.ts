"use client";
import { Catalogue } from "@/types/Product";
import { SaleWithLines } from "@/types/Sale";
import { BuffetClass, Sale, Shift, Table } from "@/types/model";
import useSWR from "swr";

type ResultProps = {
  ok: boolean;
  table?: Table;
  sale?: SaleWithLines | null;
  catalogue: Catalogue[];
  buffets: BuffetClass[];
  msg?: string;
};

export default function useTable(id: string) {
  const { data, isLoading } = useSWR<ResultProps>(`/api/table/${id}`);
  return {
    table: data?.table,
    sale: data?.sale,
    catalogue: data?.catalogue,
    buffets: data?.buffets,
    isLoading,
  };
}
