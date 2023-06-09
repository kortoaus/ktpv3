"use client";
import TableUpdate from "@/screens/TableUpdate";
import DataLoading from "@/components/ui/DataLoading";
import { ApiResultType } from "@/types/api";
import { Table } from "@/types/model";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    id: string;
    tIdx: string;
  };
};

type ResultProps = ApiResultType & {
  result?: Table;
};

export default function NewTablePage({ params: { id, tIdx } }: Props) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState<Table>();

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch(
        `/api/tcontainer/${id}/table/${tIdx}`
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
  }, [id, tIdx]);

  return (
    <main className="fccc">
      {loading && <DataLoading />}
      {err && <div className="h-full fccc text-red-500">{err}</div>}
      {!loading && !err && <TableUpdate data={data} cId={+id} tId={+tIdx} />}
    </main>
  );
}
