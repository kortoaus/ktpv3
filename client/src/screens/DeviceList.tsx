"use client";

import DeviceListCard from "@/components/DeviceListCard";
import { DeviceWithTable } from "@/types/Device";
import { PagingProps } from "@/types/api";
import React from "react";

type Props = {
  list: DeviceWithTable[];
  paging: PagingProps;
};

export default function DeviceList({ list, paging }: Props) {
  return (
    <div className="List">
      {list.map((data) => {
        return <DeviceListCard paging={paging} key={data.id} data={data} />;
      })}
    </div>
  );
}
