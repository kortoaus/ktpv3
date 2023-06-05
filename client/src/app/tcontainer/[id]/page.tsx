"use client";
import { ApiResultType } from "@/types/api";
import { TableContainer } from "@/types/model";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import TableContainerList from "@/app/screens/TableContainerList";
import TableContainerUpdate from "@/app/screens/TableContainerUpdate";
import DataLoading from "@/components/ui/DataLoading";

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
    <main className="fccc">
      {loading && <DataLoading />}
      {err && <div className="h-full fccc text-red-500">{err}</div>}
      {!loading && data && <TableContainerUpdate data={data} />}
    </main>
  );
}
