"use client";

import StaffListCard from "@/components/StaffListCard";
import { PagingProps } from "@/types/api";
import { Staff } from "@/types/model";
import React from "react";

type Props = {
  list: Staff[];
  paging: PagingProps;
};

export default function StaffList({ list, paging }: Props) {
  return (
    <div className="List">
      {list.map((data) => {
        return <StaffListCard paging={paging} key={data.id} data={data} />;
      })}
    </div>
  );
}
