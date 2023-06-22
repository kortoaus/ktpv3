"use client";
import { Sale, Shift, Table } from "@/types/model";
import useSWR from "swr";

type ResultProps = {
  ok: boolean;
  table?: Table;
  sale?: Sale | null;
  msg?: string;
};

export default function useTable(id: string) {
  const { data, isLoading } = useSWR<ResultProps>(`/api/table/${id}`);
  return {
    table: data?.table,
    sale: data?.sale,
    isLoading,
  };
}
