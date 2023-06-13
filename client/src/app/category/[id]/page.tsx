"use client";
import { ApiResultType } from "@/types/api";
import { Category } from "@/types/model";
import React, { useEffect, useState } from "react";
import DataLoading from "@/components/ui/DataLoading";
import CategoryUpdate from "@/screens/CategoryUpdate";

type ResultProps = ApiResultType & {
  result?: Category;
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

export default function CategoryDetailPage({
  params: { id },
  searchParams,
}: Props) {
  const [data, setData] = useState<Category>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch(
        `/api/category/${id}`
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
      {loading && <DataLoading />}
      {err && <div className="h-full fccc text-red-500">{err}</div>}
      {!loading && data && <CategoryUpdate query={searchParams} data={data} />}
    </main>
  );
}
