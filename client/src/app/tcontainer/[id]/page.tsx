"use client";
import { ApiResultType } from "@/types/api";
import { TableContainer } from "@/types/model";
import React, { useEffect, useState } from "react";
import TableContainerUpdate from "@/screens/TableContainerUpdate";
import DataLoading from "@/components/ui/DataLoading";
import Link from "next/link";

type ResultProps = ApiResultType & {
  result?: TableContainer;
};

type Props = {
  params: {
    id: string;
  };
};

export default function TContainerDetailPage({ params: { id } }: Props) {
  const [data, setData] = useState<TableContainer>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch(
        `/api/tcontainer/${id}`
      )
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
      <div className="mb-4 border-b flex items-center h-16 px-8 gap-4">
        <Link href="/" prefetch={false}>
          <button className="BasicBtn">Go Home</button>
        </Link>
        <h1>Table Container</h1>
      </div>
      {loading && <DataLoading />}
      {err && <div className="h-full fccc text-red-500">{err}</div>}
      {!loading && data && <TableContainerUpdate data={data} />}
    </main>
  );
}
