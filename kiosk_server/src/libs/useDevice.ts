"use client";
import { Device } from "@/types/model";
import useSWR from "swr";

type ResultProps = {
  ok: boolean;
  result?: Device;
};

export default function useDevice() {
  const { data, isLoading } = useSWR<ResultProps>("/api/me");
  return { device: data?.result, isLoading };
}
