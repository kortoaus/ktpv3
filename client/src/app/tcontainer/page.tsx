"use client";
import { ApiResultType } from "@/types/api";
import { TableContainer } from "@/types/model";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import TableContainerList from "../../screens/TableContainerList";
import Link from "next/link";

type ResultProps = ApiResultType & {
  result: TableContainer[];
};

export default function TContainerListPage() {
  const [data, setData] = useState<TableContainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch("/api/tcontainer")
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
      setData([]);
      return;
    };

    getData();
  }, []);

  return (
    <main className="">
      {loading && (
        <div className="h-full fccc">
          <CircularProgress />
        </div>
      )}
      {err && <div className="h-full fccc text-red-500">{err}</div>}
      {!loading && (
        <>
          <div className="mb-4 border-b flex items-center h-16 px-8 gap-4">
            <Link href="/" prefetch={false}>
              <button className="BasicBtn">Go Home</button>
            </Link>
            <h1>Table Container</h1>
          </div>
          <TableContainerList list={data} />
        </>
      )}
    </main>
  );
}
