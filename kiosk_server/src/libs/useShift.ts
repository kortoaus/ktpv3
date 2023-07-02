"use client";
import { SaleWithTotal } from "@/types/Sale";
import { Sale, Shift } from "@/types/model";
import useSWR from "swr";

type ResultProps = {
  ok: boolean;
  shift?: Shift | null;
  sales: SaleWithTotal[];
  msg?: string;
};

export default function useShift() {
  const { data, isLoading: shiftLoading } = useSWR<ResultProps>("/api/shift");
  return { shift: data?.shift, sales: data?.sales, shiftLoading };
}
