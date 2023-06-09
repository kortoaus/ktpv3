"use client";
import { ApiResultType } from "@/types/api";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import BuffetList from "../../screens/BuffetList";
import { BuffetClass } from "@/types/model";

type ResultProps = ApiResultType & {
  result: BuffetClass[];
};

export default function BuffetListPage() {
  const [data, setData] = useState<BuffetClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch("/api/buffet")
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
      {!loading && <BuffetList list={data} />}
    </main>
  );
}
