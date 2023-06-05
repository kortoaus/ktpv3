"use client";
import { Shift } from "@/types/model";
import useSWR from "swr";

type ResultProps = {
  ok: boolean;
  shift?: Shift | null;
  msg?: string;
};

export default function useShift() {
  const { data, isLoading: shiftLoading } =
    useSWR<ResultProps>("/api/shift/current");
  return { shift: data?.shift, shiftLoading };
}
