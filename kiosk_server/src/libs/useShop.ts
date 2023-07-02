"use client";
import { Shop } from "@/types/model";
import useSWR from "swr";

type ResultProps = {
  ok: boolean;
  result?: Shop | null;
  msg?: string;
};

export default function useShop() {
  const { data, isLoading } = useSWR<ResultProps>("/api/shop");
  return { shop: data?.result, isLoading };
}
