"use client";
import { ApiResultType } from "@/types/api";
import { BuffetClass } from "@/types/model";
import React, { useEffect, useState } from "react";
import DataLoading from "@/components/ui/DataLoading";
import BuffetUpdate from "@/app/screens/BuffetUpdate";

type ResultProps = ApiResultType & {
  result?: BuffetClass;
};

type Props = {
  params: {
    id: string;
  };
};

export default function BuffetDetailPage({ params: { id } }: Props) {
  const [data, setData] = useState<BuffetClass>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch(`/api/buffet/${id}`)
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
      {!loading && data && <BuffetUpdate data={data} />}
    </main>
  );
}
