import Link from "next/link";
import React from "react";
import { PagingProps } from "@/types/api";
import { DeviceWithTable } from "@/types/Device";

type Props = {
  data: DeviceWithTable;
  paging: PagingProps;
};

export default function DeivceListCard({
  data: { id, name, type, table },
  paging,
}: Props) {
  const { current, keyword } = paging;

  return (
    <div className="grid grid-cols-12 border-b py-4">
      <div className="col-span-2 flex items-center justify-start">
        <Link
          href={`/device/${id}?page=${current}&keyword=${keyword}`}
          prefetch={false}
        >
          <div className="font-medium">{type}</div>
        </Link>
      </div>
      <div className="col-span-4 flex items-center justify-start">
        <Link
          href={`/device/${id}?page=${current}&keyword=${keyword}`}
          prefetch={false}
        >
          <div className="font-medium">{name}</div>
        </Link>
      </div>

      <div className="col-span-4 flex items-center justify-start">
        <Link
          href={`/device/${id}?page=${current}&keyword=${keyword}`}
          prefetch={false}
        >
          <div className="font-medium">
            {table ? `${table.container.name} / ${table.name}` : ""}
          </div>
        </Link>
      </div>

      <div className="col-span-2 fccc text-blue-500">
        <Link
          href={`/device/${id}?page=${current}&keyword=${keyword}`}
          prefetch={false}
        >
          Update
        </Link>
      </div>
    </div>
  );
}
