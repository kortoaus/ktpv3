"use client";
import { ApiResultType, PaginationResult, PagingProps } from "@/types/api";
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import CategoryList from "../../screens/CategoryList";
import { Device, Printer } from "@/types/model";
import PrinterList from "../../screens/PrinterList";
import ListWrapper from "@/components/ListWrapper";
import DeviceList from "@/screens/DeviceList";
import { DeviceWithTable } from "@/types/Device";

type Props = {
  searchParams: {
    page?: string;
    keyword?: string;
  };
};

export default function DeviceListPage({
  searchParams: { page, keyword },
}: Props) {
  const [data, setData] = useState<DeviceWithTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [paging, setPaging] = useState<null | PagingProps>(null);

  console.log(data);

  useEffect(() => {
    const getData = async () => {
      const {
        ok,
        result,
        msg,
        hasNext,
        hasPrev,
        totalPages,
      }: PaginationResult<DeviceWithTable> = await fetch(
        encodeURI(`/api/device?page=${page || 1}&keyword=${keyword || ""}`)
      )
        .then((res) => res.json())
        .then((data) => data)
        .finally(() => setLoading(false));
      if (ok && result) {
        setData(result);
        setPaging({
          hasNext,
          hasPrev,
          totalPages,
          current: page ? +page : 1,
          keyword: keyword ? keyword : "",
        });
        return;
      }

      if (!ok && msg) {
        setErr(msg);
      }
      setData([]);
      return;
    };

    getData();
  }, [page, keyword]);

  return (
    <main className="">
      {loading && (
        <div className="h-full fccc">
          <CircularProgress />
        </div>
      )}
      {err && <div className="h-full fccc text-red-500">{err}</div>}
      {!loading && data && paging && (
        <ListWrapper paging={paging} basePath="/device">
          <DeviceList paging={paging} list={data} />
        </ListWrapper>
      )}
    </main>
  );
}
