import { TableContainer } from "@/types/model";
import Link from "next/link";
import React from "react";

type Props = {
  data: TableContainer;
};

export default function TableContainerListCard({
  data: { id, name, index },
}: Props) {
  return (
    <div className="grid grid-cols-12 border-b py-4">
      <div className="col-span-2 flex items-center justify-start text-sm">
        {index}
      </div>
      <div className="col-span-6 flex items-center justify-start font-medium">
        <Link href={`/tcontainer/${id}/table`} prefetch={false}>
          {name}
        </Link>
      </div>
      <div className="col-span-2 fccc">
        <Link
          href={`/tcontainer/${id}/`}
          prefetch={false}
          className="text-blue-500 text-sm"
        >
          Update
        </Link>
      </div>
      <div className="col-span-2 fccc">
        <Link
          href={`/tcontainer/${id}/table`}
          prefetch={false}
          className="text-blue-500 text-sm"
        >
          Tables
        </Link>
      </div>
    </div>
  );
}
