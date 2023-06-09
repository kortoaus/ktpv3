"use client";
import { ApiResultType } from "@/types/api";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import CategoryList from "../../screens/CategoryList";
import { CategoryWithProductCount } from "@/types/Product";

type ResultProps = ApiResultType & {
  result: CategoryWithProductCount[];
};

export default function CategoryListPage() {
  const [data, setData] = useState<CategoryWithProductCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const getData = async () => {
      const { ok, result, msg }: ResultProps = await fetch("/api/category")
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
      {!loading && <CategoryList list={data} />}
    </main>
  );
}
