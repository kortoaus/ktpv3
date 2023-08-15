"use client";
import { ApiResultType } from "@/types/api";
import React, { useEffect, useState } from "react";
import DataLoading from "@/components/ui/DataLoading";
import { SaleWithLines } from "@/types/Sale";
import ReceiptDetail from "@/screens/ReceiptDetail";

type ResultProps = ApiResultType & {
  result?: SaleWithLines;
};

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    page: string;
    keyword: number;
  };
};

export default function DeviceDetailPage({
  params: { id },
  searchParams,
}: Props) {
  const [data, setData] = useState<SaleWithLines | undefined>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const printHandler = async () => {
    if (!id) {
      return;
    }

    const { ok, result, msg }: ResultProps = await fetch(
      `/api/receipt/${id}/print`
    );

    return;
  };

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch(`/api/receipt/${id}`)
        .then((res) => res.json())
        .then((data) => data)
        .finally(() => setLoading(false));

      if (ok && result) {
        setData(result);
        return;
      }

      if (!ok && msg) {
        setErr(msg);
      }
      setData(undefined);
      return;
    };

    getData();
  }, [id]);

  const isLoading = loading;

  return (
    <main className="">
      {isLoading && <DataLoading />}
      {err && <div className="h-full fccc text-red-500">{err}</div>}
      {!isLoading && data && (
        <ReceiptDetail print={() => printHandler()} sale={data} />
      )}
    </main>
  );
}
