"use client";
import { ApiResultType } from "@/types/api";
import { Device } from "@/types/model";
import React, { useEffect, useState } from "react";
import DataLoading from "@/components/ui/DataLoading";
import DeviceUpdate from "@/screens/DeviceUpdate";
import useSWR from "swr";
import { TableContainerWithTables } from "@/types/Table";

type ResultProps = ApiResultType & {
  result?: Device;
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
  const { data: tData, isLoading: tLoading } = useSWR<{
    ok: boolean;
    result: TableContainerWithTables[];
  }>(`/api/table`);
  const [data, setData] = useState<Device>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch(`/api/device/${id}`)
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

  const isLoading = tLoading || loading;

  return (
    <main className="">
      {isLoading && <DataLoading />}
      {err && <div className="h-full fccc text-red-500">{err}</div>}
      {!isLoading && data && (
        <DeviceUpdate
          tables={tData && tData.ok ? tData.result : []}
          query={searchParams}
          data={data}
        />
      )}
    </main>
  );
}
