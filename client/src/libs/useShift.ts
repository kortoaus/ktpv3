"use client";
import { ShiftResultType } from "@/types/Shift";
import { Sale, Shift } from "@/types/model";
import useSWR from "swr";

type ResultProps = {
  ok: boolean;
  shift?: Shift | null;
  sales?: Sale[] | null;
  shiftResult: ShiftResultType;
  msg?: string;
};

export default function useShift() {
  const { data, isLoading: shiftLoading } =
    useSWR<ResultProps>("/api/shift/current");

  return {
    shift: data?.shift,
    sales: data?.sales,
    shiftResult: data?.shiftResult,
    shiftLoading,
  };
}
