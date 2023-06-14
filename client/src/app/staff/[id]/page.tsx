"use client";
import { ApiResultType } from "@/types/api";
import { Staff } from "@/types/model";
import React, { useEffect, useState } from "react";
import DataLoading from "@/components/ui/DataLoading";
import StaffUpdate from "@/screens/StaffUpdate";

type ResultProps = ApiResultType & {
  result?: Staff;
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

export default function PrinterDetailPage({
  params: { id },
  searchParams,
}: Props) {
  const [data, setData] = useState<Staff>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch(`/api/staff/${id}`)
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

  return (
    <main className="">
      {loading && <DataLoading />}
      {err && <div className="h-full fccc text-red-500">{err}</div>}
      {!loading && data && <StaffUpdate query={searchParams} data={data} />}
    </main>
  );
}
