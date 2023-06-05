"use client";
import { Staff } from "@/types/model";
import useSWR from "swr";

type ResultProps = {
  ok: boolean;
  staff?: Staff;
  msg?: string;
};

export default function useStaff() {
  const { data, isLoading: staffLoading } = useSWR<ResultProps>("/api/auth/me");
  return { staff: data?.staff, staffLoading };
}
