"use client";
import { ApiResultType } from "@/types/api";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import CategoryList from "../../screens/CategoryList";
import { Printer } from "@/types/model";
import PrinterList from "../../screens/PrinterList";

type ResultProps = ApiResultType & {
  result: Printer[];
};

export default function CategoryListPage() {
  const [data, setData] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch("/api/printer")
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
      {!loading && <PrinterList list={data} />}
    </main>
  );
}
