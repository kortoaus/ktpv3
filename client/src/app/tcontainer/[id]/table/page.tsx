"use client";
import TableManager from "@/app/screens/TableManager";
import DataLoading from "@/components/ui/DataLoading";
import { TableContainerWithTables } from "@/types/Table";
import { ApiResultType } from "@/types/api";
import React, { useEffect, useState } from "react";

type ResultProps = ApiResultType & {
  result?: TableContainerWithTables;
};

type Props = {
  params: {
    id: string;
  };
};

export default function TableManagePage({ params: { id } }: Props) {
  const [data, setData] = useState<TableContainerWithTables>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch(
        `/api/tcontainer/${id}/table`
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
    <main>
      {loading && <DataLoading />}
      {err && <div className="h-full fccc text-red-500">{err}</div>}
      {data && !loading && <TableManager data={data} />}
    </main>
  );
}
