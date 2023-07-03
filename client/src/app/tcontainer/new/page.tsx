import React from "react";
import TableContainerUpdate from "@/screens/TableContainerUpdate";
import Link from "next/link";

type Props = {};

export default function TContainerDetailPage({}: Props) {
  return (
    <main className="">
      <div className="mb-4 border-b flex items-center h-16 px-8 gap-4">
        <Link href="/" prefetch={false}>
          <button className="BasicBtn">Go Home</button>
        </Link>
        <h1>Table Container</h1>
      </div>
      <TableContainerUpdate />
    </main>
  );
}
